<script setup lang="ts" name="Layout">
import Logo from "@/views/layout/logo/Index.vue";
import LayoutMenu from "@/views/layout/menu/Index.vue";
import useUserStore from "@/store/modules/user";
import { useRoute } from "vue-router";
import LayoutMain from "@/views/layout/main/Index.vue";
import LayoutTabbar from "@/views/layout/tabbar/Index.vue";
import useSettingStore from "@/store/modules/setting";

const userStore = useUserStore();
const $route = useRoute();
const menuList = userStore.menuRoutes;
const layoutSettingStore = useSettingStore();
</script>

<template>
  <div class="layout_container">
    <!-- 左侧菜单栏 -->
    <div
      class="layout_slider"
      :class="{
        fold: layoutSettingStore.fold,
      }"
    >
      <Logo />

      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#001529"
          text-color="white"
          class="el-menu-vertical-demo"
          :default-active="$route.path"
          :collapse="layoutSettingStore.fold"
        >
          <LayoutMenu :menuList="menuList" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <LayoutTabbar />
    <!-- 主要内容区域 -->
    <div
      class="layout_main"
      :class="{
        fold: layoutSettingStore.fold,
        dark: layoutSettingStore.darkMode,
      }"
    >
      <LayoutMain />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    color: white;

    // 滚动组件
    .scrollbar {
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-min-width;
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    top: 0;
    left: $base-menu-width;
    height: $base-tabbar-height;

    background-color: pink;
  }
  .layout_main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    overflow: auto;
    padding: 20px;

    // background-color: antiquewhite;
    // 添加一个渐变色背景色
    background: linear-gradient(to bottom, #f5f5f5, #e5e5e5);

    /* 隐藏时的样式 */
    &.fold {
      left: $base-menu-min-width;
      width: calc(100% - $base-menu-min-width);
    }

    &.dark {
      background: var(--el-bg-color-overlay);
    }
  }
}
</style>
