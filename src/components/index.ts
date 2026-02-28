import type { App } from "vue";
import SvgIcon from "./SvgIcon/Index.vue";
import Category from "./Category/Index.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const allGloablComponent: any = { SvgIcon, Category };

export default {
  install(app: App) {
    // 注册全局组件
    Object.entries(allGloablComponent).forEach(([name, component]: any) => {
      // console.log(name, component);
      app.component(name, component);
    });

    // 全局注册 ElementPlus 图标组件
    // 后续下面这段 注册全局组件的代码 移动到 src/components/index.ts 插件中做统一封装
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
