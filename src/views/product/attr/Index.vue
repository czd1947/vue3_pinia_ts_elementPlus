<script setup lang="ts" name="ProductAttr">
import useCategoryStore from "@/store/modules/category";
import type {
  Attribute,
  AttributeDeleteResponseData,
  AttributeResponseData,
  AttributeValues,
} from "@/api/category/type";
import {
  reqAttrList,
  reqAttrCreate,
  reqAttrUpdate,
  reqAttrDelete,
  reqAttrValueDelete,
} from "@/api/category";
import { ref, watch, onMounted, reactive, onBeforeUnmount } from "vue";

const categoryStore = useCategoryStore();
const attrList = ref<Attribute[]>([]);

const pageNo = ref(1);
const limit = ref(10);
const background = ref<boolean>(true);
const total = ref<number>(0);
const sizeChange = (currentPage: number, pageSize: number) => {
  limit.value = pageSize;
  pageNo.value = currentPage;
  getAttrValueList();
};

watch(
  () => categoryStore.c3Id,
  (newVal, oldVal) => {
    if (newVal) {
      getAttrValueList();
    }
  },
);

onMounted(() => {
  getAttrValueList();
});

onBeforeUnmount(() => {
  // 清空分类仓库数据
  categoryStore.$reset();
});

const getAttrValueList = async () => {
  const res = await reqAttrList(
    Number(categoryStore.c1Id),
    Number(categoryStore.c2Id),
    Number(categoryStore.c3Id),
  );
  if (res.code === 200) {
    attrList.value = res.data.data || [];
    total.value = res.data.total || 0;
  }
};

const handleAdd = () => {
  scene.value = 1;
  Object.assign(attrParams, {
    attr_name: "", //新增的属性的名字
    attr_values: [
      //新增的属性值数组
    ],
    attr_value: [
      //新增的属性值对象数组
    ],
    category_id_1: Number(categoryStore.c1Id),
    category_id_2: Number(categoryStore.c2Id),
    category_id_3: Number(categoryStore.c3Id),
    is_required: 0,
    sort_order: 50,
  });
};

const handleEdit = (row: Attribute) => {
  console.log("编辑属性", row);
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
  scene.value = 1;
};

const handleDelete = (row: Attribute) => {
  console.log("删除属性", row);
  reqAttrDelete(row.id || 0).then((res: AttributeDeleteResponseData) => {
    if (res.success && res.code === 200) {
      ElMessage.success("删除属性成功");
      getAttrValueList();
    } else {
      ElMessage.error(res.message || "删除属性失败");
    }
  });
};

const scene = ref<number>(0);

const cancelDialog = () => {
  scene.value = 0;
};

const attrParams = reactive<Attribute>({
  attr_name: "", //新增的属性的名字
  attr_values: [
    //新增的属性值数组
  ],
  attr_value: [
    //新增的属性值对象数组
  ],
  category_id_1: Number(categoryStore.c1Id),
  category_id_2: Number(categoryStore.c2Id),
  category_id_3: Number(categoryStore.c3Id),
  is_required: 0,
  sort_order: 50,
});
const addAttrValue = () => {
  attrParams.attr_value.push({
    attr_value: "",
    flag: 0, // 可写状态
  });
};

const handleSubmit = async () => {
  if (!attrParams.attr_name) {
    ElMessage.error("属性名称不能为空");
    return;
  }
  if (!attrParams.attr_value.length) {
    ElMessage.error("属性值不能为空");
    return;
  }
  let res: AttributeResponseData;
  if (attrParams.id) {
    res = await reqAttrUpdate(attrParams.id || 0, attrParams);
  } else {
    res = await reqAttrCreate(attrParams);
  }
  if (res.code === 200) {
    ElMessage.success(attrParams.id ? "编辑属性成功" : "新增属性成功");
    scene.value = 0;
    getAttrValueList();
  } else {
    ElMessage.error(
      res.message || (attrParams.id ? "编辑属性失败" : "新增属性失败"),
    );
  }
};

const toLook = (row: AttributeValues, index: number) => {
  // 非空数据校验
  if (!row.attr_value.trim()) {
    ElMessage.error("属性值不能为空");
    return;
  }

  // 查重
  const isExist = attrParams.attr_value.find((item) => {
    if (item != row) {
      return item.attr_value === row.attr_value;
    }
  });
  if (isExist) {
    // 删除重复项
    attrParams.attr_value.splice(index, 1);
    ElMessage.error("属性值已存在");
    return;
  }

  row.flag = 1;
};

const toEdit = (row: AttributeValues) => {
  row.flag = 0;
};

const toDel = async (row: AttributeValues, index: number) => {
  attrParams.attr_value.splice(index, 1);
  if (row.id) {
    await reqAttrValueDelete(row.id || 0);
  }
};
</script>

<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card>
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="handleAdd"
        :disabled="!categoryStore.c3Id"
        v-show="scene === 0"
      >
        添加属性
      </el-button>
      <div v-if="scene === 0">
        <el-table border style="margin: 10px 0px" :data="attrList">
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性值" prop="attr_values">
            <template #="{ row }">
              <el-tag
                v-for="(item, index) in row.attr_values"
                :key="index"
                style="margin-right: 5px"
              >
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="属性操作">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-popconfirm
                :title="`您确认要删除属性：${scope.row.attr_name}吗?`"
                width="250px"
                icon="Delete"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="limit"
          :page-sizes="[10, 20, 50, 100, 500, 1000]"
          :background="background"
          layout=" prev, pager, next, jumper,->,total, sizes,"
          :total="total"
          @change="sizeChange"
        />
      </div>
      <div v-if="scene === 1">
        <el-form line style="margin: 10px 0">
          <el-form-item label="属性名称">
            <el-input
              style="width: 220px"
              placeholder="请输入属性名称"
              v-model="attrParams.attr_name"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attr_name === ''"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrParams.attr_value">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称" prop="attr_value">
            <template #="{ row, $index }">
              <el-input
                style="width: 220px"
                placeholder="请输入属性值名称"
                v-model="row.attr_value"
                v-if="row.flag === 0"
                @blur="toLook(row, $index)"
              ></el-input>
              <div v-else @click="toEdit(row)">{{ row.attr_value }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="scope">
              <el-button
                type="danger"
                icon="Delete"
                @click="toDel(scope.row, scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button type="primary" @click="cancelDialog">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
