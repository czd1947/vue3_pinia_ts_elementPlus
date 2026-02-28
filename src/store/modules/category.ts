import { defineStore } from "pinia";
import { reqCategoryList } from "@/api/category";
import type { CategoryResponseData, Category } from "@/api/category/type";

export default defineStore("category", {
  state: () => ({
    // 存储一级分类的数据
    c1Attr: [] as Category[],
    // 存储一级分类的ID
    c1Id: "",
    // 存储二级分类数据
    c2Attr: [] as Category[],
    // 存储二级分类的ID
    c2Id: "",
    // 存储三级分类数据
    c3Attr: [] as Category[],
    // 存储三级分类的ID
    c3Id: "",
  }),
  actions: {
    // 初始化一级分类数据
    async getCategory1List() {
      const res: CategoryResponseData = await reqCategoryList();

      this.c1Attr = res.data;
    },
    // 切换一级分类时 获取二级分类数据
    async getCategory2List(category1Id: number) {
      const res: CategoryResponseData = await reqCategoryList(category1Id);

      this.c2Attr = res.data;
    },
    // 切换二级分类时 获取三级分类数据
    async getCategory3List(category2Id: number) {
      const res: CategoryResponseData = await reqCategoryList(category2Id);

      this.c3Attr = res.data;
    },
  },
});
