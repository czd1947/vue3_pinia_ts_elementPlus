import { defineStore } from "pinia";
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from "@/api/user/type";
import type { UserState } from "@/store/modules/types/type";
import { constantRoutes, asyncRoutes, anyRoutes } from "@/router/routes";
import router from "@/router";
import cloneDeep from "lodash/cloneDeep";

/**
 * 过滤需要展示的异步路由(前端路由)
 * @param frontRoutes 前端路由
 * @param backendRoutes 后端路由
 * @returns 过滤后的异步路由
 */
function filterAsyncRoute(frontRoutes: any, backendRoutes: any) {
  return frontRoutes.filter((item: any) => {
    if (backendRoutes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, backendRoutes);
      }
      return true;
    }
    return false;
  });
}

export default defineStore("user", {
  state: (): UserState => ({
    token: "",
    // 默认使用 常量路由
    menuRoutes: constantRoutes,
    username: "",
    avatar: "",
    roles: [],
    routes: [],
    buttons: [],
    // 标记动态路由是否已添加（刷新页面时需要重新添加）
    routesAdded: false,
  }),
  actions: {
    async login(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data);
      if (result.code === 200) {
        this.token = result.data.token;

        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    async getUserInfo() {
      const result: userInfoResponseData = await reqUserInfo();
      if (result.code === 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        this.roles = result.data.roles;
        this.routes = result.data.routes;
        this.buttons = result.data.buttons;

        // 判断是否为超级管理员
        if (this.roles.includes("超级管理员")) {
          // 展示所有路由
          this.menuRoutes = [...constantRoutes, ...asyncRoutes, anyRoutes];
          // 将 计算出的用户路由 和 任意路由 动态追加到 路由器中
          [...asyncRoutes, anyRoutes].forEach((route: any) => {
            router.addRoute(route);
          });
          this.routesAdded = true;
        } else {
          // 计算当前用户需要展示的异步路由
          const userAsyncRoutes = filterAsyncRoute(
            cloneDeep(asyncRoutes), // 这边使用深度拷贝，以免影响原始数据
            this.routes,
          );
          // 需要显示的菜单
          this.menuRoutes = [...constantRoutes, ...userAsyncRoutes, anyRoutes];
          // 将 计算出的用户路由 和 任意路由 动态追加到 路由器中
          [...userAsyncRoutes, anyRoutes].forEach((route: any) => {
            router.addRoute(route);
          });
          this.routesAdded = true;
        }

        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    async logout() {
      await reqLogout();
      this.token = "";
      this.username = "";
      this.avatar = "";
      this.roles = [];
      this.routes = [];
      this.buttons = [];
    },
  },
  getters: {},
  persist: {
    key: "userStore", // 存储在本地时的 key 名称
    pick: ["token", "roles", "routes", "buttons", "username"], // 需要持久化的数据
  },
});
