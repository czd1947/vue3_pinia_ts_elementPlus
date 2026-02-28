<script setup lang="ts" name="LayoutMenu">
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  menuList: {
    type: Array,
    default: () => [],
  },
});

const goRoute = (vc: any) => {
  router.push(vc.index);
};
</script>

<template>
  <template v-for="(item, index) in menuList" :key="item.path">
    <template v-if="!item.children">
      <el-menu-item
        :index="item.path"
        @click="goRoute"
        v-if="!item.meta.hidden"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <template
      v-if="
        item.children && (item.children.length == 1 || item.name === 'layout')
      "
    >
      <el-menu-item
        :index="item.children[0].path"
        v-if="!item.children[0].meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有多个子路由 -->
    <template
      v-if="item.children && item.children.length > 1 && item.name !== 'layout'"
    >
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <LayoutMenu :menuList="item.children"></LayoutMenu>
      </el-sub-menu>
    </template>
  </template>
</template>

<style lang="scss" scoped></style>
