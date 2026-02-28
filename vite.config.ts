import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { viteMockServe } from "vite-plugin-mock";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 获取各种环境下的对应的变量
  let env = loadEnv(mode, process.cwd());
  // console.log("vite.config.js env:", env);
  return {
    plugins: [
      vue(),
      viteMockServe({
        // 配置 mock 文件夹的路径
        mockPath: "./mock",
        // 是否开启本地开发模式，开启后会监听 mock 文件的变化
        enable: true, // 是否启用mock
        watchFiles: true, // 监视文件更改
        logger: true, // 是否在控制台显示请求日志
      }),
      // ElementPlus 按需引入
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      VueSetupExtend(),
      // 引入 svg 图标插件
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定 symbolId 格式
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 注意：如果使用别名（如@），需要先配置 resolve.alias。
          additionalData: `@use "@/assets/scss/_variable.scss" as *;`,
        },
      },
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE + env.VITE_APP_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
