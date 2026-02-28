import { defineStore } from "pinia";

export default defineStore("setting", {
  state: () => ({
    fold: false,
    // 控制刷新效果
    refresh: false,
    // 主题颜色
    color: "rgba(19, 206, 102, 0.8)",
    // 暗黑模式开关 (存储在浏览器缓存中)
    darkMode: false,
  }),
  persist: {
    key: "layout-setting-store", // 存储在本地时的 key 名称
    pick: ["fold", "darkMode", "color"], // 需要持久化的数据
  },
});
