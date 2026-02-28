<script setup lang="ts" name="SpuForm">
import { ref } from "vue";

const fileList = ref([]);

const handlePictureCardPreview = () => {};
const handleRemove = () => {};
const dialogVisible = ref(false);
const dialogImageUrl = ref("");
</script>

<template>
  <el-card>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="请你输入SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select>
          <el-option label="华为"></el-option>
          <el-option label="oppo"></el-option>
          <el-option label="vivo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请你输入SPU描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          v-model:file-list="fileList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性" size="normal">
        <!-- 展示销售属性的下拉菜单 -->
        <el-select>
          <el-option label="华为"></el-option>
          <el-option label="oppo"></el-option>
          <el-option label="vivo"></el-option>
        </el-select>
        <el-button
          style="margin-left: 10px"
          type="primary"
          size="default"
          icon="Plus"
        >
          添加属性
        </el-button>
        <!-- table展示销售属性与属性值的地方 -->
        <el-table border style="margin: 10px 0px">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="销售属性名字"
            width="120px"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column label="销售属性值">
            <!-- row:即为当前SPU已有的销售属性对象 -->
          </el-table-column>
          <el-table-column label="操作" width="120px"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">保存</el-button>
        <el-button type="primary" size="default" @click="cancel"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped></style>
