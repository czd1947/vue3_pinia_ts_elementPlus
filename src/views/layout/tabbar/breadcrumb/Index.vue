<template>
  <!-- 顶部左侧的图标 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component
      style="cursor: pointer"
      :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"
    ></component>
  </el-icon>
  <!-- 左侧的面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="item in $route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="item.path"
      >{{ item.meta.title }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script setup lang="ts" name="Breadcrumb">
import useSettingStore from "@/store/modules/setting";
const layoutSettingStore = useSettingStore();

// 点击切换左侧菜单图标
const changeIcon = () => {
  layoutSettingStore.fold = !layoutSettingStore.fold;
};
</script>
<style scoped lang="scss"></style>
