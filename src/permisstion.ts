import router from "@/router";
import nprogress from "nprogress";
import setting from "@/setting";
//引入进度条样式
import "nprogress/nprogress.css";

//进度条的加载圆圈不要
nprogress.configure({ showSpinner: false });
import useUserStore from "@/store/modules/user";
import pinia from "./store";

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore(pinia);
  // 设置网页的标题
  document.title = to.meta.title
    ? `${setting.title} - ${to.meta.title}`
    : setting.title;

  nprogress.start();

  //获取token，去判断用户登录、还是未登录
  const token = userStore.token;

  let username = userStore.username;
  if (token) {
    //登陆成功，访问login。指向首页
    if (to.path === "/login") {
      next("/home");
    } else {
      // 登陆成功访问其余的，放行有用户信息
      if (username) {
        // 刷新页面时，如果动态路由尚未添加，需要重新添加
        if (!userStore.routesAdded) {
          try {
            await userStore.getUserInfo();
            next({ ...to, replace: true });
          } catch (error) {
            userStore.logout();
            next({ path: "/login", query: { redirect: to.path } });
          }
        } else {
          next();
        }
      } else {
        //如果没有用户信息，在收尾这里发请求获取到了用户信息再放行
        try {
          //获取用户信息
          await userStore.getUserInfo();
          // 万一刷新的时候是异步路由，有可能获取到用户信息但是异步路由没有加载完毕，出现空白效果
          // 重新导航以确保新添加的路由被匹配
          next({ ...to, replace: true });
        } catch (error) {
          // token过期|用户手动处理token
          // 退出登陆->用户相关的数据清空
          userStore.logout();
          next({ path: "/login", query: { redirect: to.path } });
        }
      }
    }
  } else {
    //未登录，访问除了login的，都跳转到login
    if (to.path !== "/login") {
      next({ path: "/login", query: { redirect: to.path } });
    } else {
      //登陆页面，放行
      next();
    }
  }
});

// 路由后置守卫
router.afterEach((to, from) => {
  nprogress.done();
});
