import { createPinia } from "pinia";
// 引入持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 创建大仓库
const pinia = createPinia();
// 安装持久化插件
pinia.use(piniaPluginPersistedstate);

export default pinia;
