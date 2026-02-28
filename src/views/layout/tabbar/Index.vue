<script setup lang="ts" name="LayoutTabbar">
import Breadcrumb from "./breadcrumb/Index.vue";
import Setting from "./setting/Index.vue";

import useSettingStore from "@/store/modules/setting";
const layoutSettingStore = useSettingStore();
</script>

<template>
  <div class="layout_tabbar" :class="{ fold: layoutSettingStore.fold }">
    <div class="tabbar_left">
      <!-- 面包屑组件 -->
      <Breadcrumb />
    </div>
    <div class="tabbar-right">
      <!-- 基础设置组件 -->
      <Setting />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout_tabbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: calc(100% - $base-menu-width);
  top: 0;
  left: $base-menu-width;
  height: $base-tabbar-height;
  background-image: linear-gradient(
    to right,
    rgb(233, 223, 223),
    rgb(155, 137, 137),
    rgb(67, 38, 38)
  );

  &.fold {
    left: $base-menu-min-width !important;
    width: calc(100% - $base-menu-min-width) !important;
  }

  .tabbar_left {
    display: flex;
    margin-left: 20px;
  }

  .tabbar-right {
    display: flex;
    align-content: center;
    cursor: pointer;
  }
}
</style>
