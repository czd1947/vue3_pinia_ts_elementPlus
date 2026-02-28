<script setup lang="ts" name="ProductSpu">
import { ref } from "vue";
import useCategoryStore from "@/store/modules/category";
import setting from "@/setting";
import SpuForm from "@/views/product/spu/SPUForm.vue";
import SkuForm from "@/views/product/spu/SkuForm.vue";

const categoryStore = useCategoryStore();
const scene = ref<number>(0);

const page = ref<number>(setting.pageInfo.page);
const limit = ref<number>(setting.pageInfo.limit);
const total = ref<number>(setting.pageInfo.total);

const addSpu = () => {
  scene.value = 1;
};
const addSku = () => {
  scene.value = 2;
};
</script>

<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card v-show="scene === 0">
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disabled="!categoryStore.c3Id"
        v-show="scene === 0"
        @click="addSpu"
      >
        添加SPU
      </el-button>

      <el-table border style="margin: 10px 0px">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="SPU名称"></el-table-column>
        <el-table-column label="SPU描述"></el-table-column>
        <el-table-column label="SPU操作"></el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="setting.pageInfo.pageSizes"
        :background="true"
        :layout="setting.pageInfo.layout"
        :total="total"
      />
    </el-card>

    <SpuForm v-show="scene === 1"></SpuForm>
    <SkuForm v-show="scene === 2"></SkuForm>
  </div>
</template>

<style lang="scss" scoped></style>
