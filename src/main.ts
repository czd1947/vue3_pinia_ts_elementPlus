import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 引入 svg 图标 (该模块是一个虚拟模块，由 Vite 插件 vite-plugin-svg-icons 在运行时生成，TypeScript 编译器无法识别)
import "virtual:svg-icons-register";
// 暗黑模式需要的样式
import "element-plus/theme-chalk/dark/css-vars.css";
// 引入全局样式
import "@/assets/scss/index.scss";
// 引入路由
import router from "./router";
// 引入路由鉴权
import "./permisstion";
import pinia from "./store";

const app = createApp(App);

// 安装自定义指令
import { isHasButtonPermission } from "@/directive/has";
isHasButtonPermission(app);

// 安装大仓库
app.use(pinia);

// 引入全局组件插件
import globalComponent from "@/components";
app.use(globalComponent);

// 注册语言包
app.use(ElementPlus, {
  locale: zhCn,
});

// 注册路由
app.use(router);

app.mount("#app");
