import pinia from "@/store";
import useUserStore from "@/store/modules/user";

export const isHasButtonPermission = (app: any) => {
  // 代表使用这个全局自定义指令的DOM | 组件挂载完毕的时候会执行一次
  app.directive("has", {
    // el 就是dom元素, options 就是指令的参数
    mounted(el: any, options: any) {
      // 在指令挂载时获取 store，确保 Pinia 已经安装
      const userStore = useUserStore(pinia);
      //自定义指令右侧的数值: 如果在用户信息buttons数组当中没有
      //从DOM树上干掉
      if (
        !userStore.roles.includes("超级管理员") &&
        !userStore.buttons.includes(options.value)
      ) {
        el.parentNode.removeChild(el);
      }
    },
  });
};
