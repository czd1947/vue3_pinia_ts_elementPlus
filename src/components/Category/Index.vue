<script setup lang="ts" name="Category">
import useCategoryStore from "@/store/modules/category";
import { onMounted, ref } from "vue";
const categoryStore = useCategoryStore();

onMounted(() => {
  categoryStore.getCategory1List();
});

const changeCategory1 = (id: number) => {
  categoryStore.getCategory2List(id);
  categoryStore.c2Id = "";
  categoryStore.c3Id = "";
  categoryStore.c2Attr = [];
  categoryStore.c3Attr = [];
};

const changeCategory2 = (id: number) => {
  categoryStore.getCategory3List(id);
  categoryStore.c3Id = "";
  categoryStore.c3Attr = [];
};

defineProps({
  scene: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <el-card style="margin-bottom: 10px">
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          placeholder="请选择一级分类"
          style="width: 180px"
          @change="changeCategory1"
          :disabled="scene !== 0"
        >
          <el-option
            v-for="item in categoryStore.c1Attr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2Id"
          placeholder="请选择二级分类"
          style="width: 180px"
          @change="changeCategory2"
          :disabled="scene !== 0"
        >
          <el-option
            v-for="item in categoryStore.c2Attr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="categoryStore.c3Id"
          placeholder="请选择三级分类"
          style="width: 180px"
          :disabled="scene !== 0"
        >
          <el-option
            v-for="item in categoryStore.c3Attr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped></style>
