<script setup lang="ts" name="LayoutMain">
import useSettingStore from "@/store/modules/setting";
const layoutSettingStore = useSettingStore();
import { ref, watch, nextTick } from "vue";

const flag = ref(true);

// 监听刷新状态
watch(
  () => layoutSettingStore.refresh,
  () => {
    // 点击刷新：路由组件销毁
    flag.value = false;

    nextTick(() => {
      flag.value = true;
    });
  },
);
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
// 淡入效果
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
