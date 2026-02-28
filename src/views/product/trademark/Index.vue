<script setup lang="ts" name="ProductTrademark">
import { ref, onMounted } from "vue";
import {
  reqBrandList,
  reqBrandCreate,
  reqBrandEdit,
  reqBrandUpdate,
  reqBrandDelete,
} from "@/api/brand";
import type { Brand } from "@/api/brand/type";
import useUserStore from "@/store/modules/user";
import { useRouter } from "vue-router";

const pageNo = ref(1);
const limit = ref(10);
const background = ref<boolean>(true);
const total = ref<number>(0);
const trademarkList = ref<Brand[]>([]);

const getBrandList = async () => {
  const res = await reqBrandList(pageNo.value, limit.value);
  if (res.success && res.code === 200) {
    trademarkList.value = res.data.data;
    total.value = res.data.total;
  } else {
    ElMessage.error(res.message || "获取品牌列表失败");
  }
};

onMounted(() => {
  getBrandList();
});

const handleEdit = async (row: Brand) => {
  dialogFormVisible.value = true;
  dialogTitle.value = "编辑品牌";
  formRef.value?.clearValidate();

  const res = await reqBrandEdit(row.id || 0);
  if (res.success && res.code === 200) {
    Object.assign(form.value, res.data);
  } else {
    ElMessage.error(res.message || "获取品牌详情失败");
  }
};

const handleDelete = async (row: Brand) => {
  const res = await reqBrandDelete(row.id || 0);
  if (res.success && res.code === 200) {
    ElMessage.success("删除品牌成功");
    getBrandList();
  } else {
    ElMessage.error(res.message || "删除品牌失败");
  }
};

const sizeChange = (currentPage: number, pageSize: number) => {
  limit.value = pageSize;
  pageNo.value = currentPage;
  getBrandList();
};

const dialogFormVisible = ref<boolean>(false);
const dialogTitle = ref<string>("添加品牌");
const form = ref<Brand>({
  id: 0,
  name: "",
  alias: "",
  logo: "",
  description: "",
  website: "",
  sort_order: 50,
  is_enabled: 1,
});
const formLabelWidth = ref<string>("100px");

const formRef = ref();
const handleSubmit = async () => {
  await formRef.value.validate();
  dialogFormVisible.value = false;

  if (form.value.id === 0) {
    // 新增品牌
    reqBrandCreate(form.value).then((res) => {
      if (res.success && res.code === 200) {
        ElMessage.success("新增品牌成功");
        getBrandList();
      } else {
        ElMessage.error(res.message || "新增品牌失败");
      }
    });
  } else {
    // 编辑品牌
    reqBrandUpdate(form.value.id || 0, form.value).then((res) => {
      if (res.success && res.code === 200) {
        ElMessage.success("编辑品牌成功");
        getBrandList();
      } else {
        ElMessage.error(res.message || "编辑品牌失败");
      }
    });
  }
};

const rules = ref({
  name: [
    { required: true, max: 100, message: "品牌名称不能为空", trigger: "blur" },
  ],
  logo: [{ required: true, message: "品牌LOGO不能为空", trigger: "blur" }],
  is_enabled: [
    { required: true, message: "品牌状态不能为空", trigger: "blur" },
  ],
  sort_order: [
    {
      required: true,
      message: "品牌排序不能为空",
      trigger: "blur",
    },
  ],
});

const userStore = useUserStore();
const $router = useRouter();

const uploadHeader = {
  Authorization: userStore.token,
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile,
) => {
  // response 是调用 upload组件的 action上传接口 后 服务器返回的数据
  // uploadFile 是包含服务器和本地上传文件信息的总和的 Proxy 对象
  if (response.code === 401) {
    ElNotification.error("登录失效，请重新登录！");
    userStore.logout();
    $router.push({
      path: "/login",
      query: { redirect: $router.currentRoute.value.path },
    });
  } else if (response.code == 200) {
    form.value.logo = response.data.url;
  } else {
    ElNotification.error(response.message);
  }
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile: any) => {
  // js 中判断 字符串是否是数组中的某一项
  const isJPG = ["image/jpeg", "image/png", "image/gif"].includes(rawFile.type);
  if (!isJPG) {
    ElMessage.error("图片格式不正确！");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过2M！");
    return false;
  }
  return true;
};

const handleAdd = () => {
  dialogFormVisible.value = true;
  dialogTitle.value = "添加品牌";
  formRef.value?.clearValidate();

  // 格式化切初始化表单值
  Object.assign(form.value, {
    id: 0,
    name: "",
    alias: "",
    logo: "",
    description: "",
    website: "",
    sort_order: 50,
    is_enabled: 1,
  });
};
</script>

<template>
  <div>
    <el-card>
      <el-button type="primary" size="default" icon="Plus" @click="handleAdd"
        >添加品牌</el-button
      >
      <el-table style="margin: 10px 0px" border :data="trademarkList">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="name"></el-table-column>
        <el-table-column label="品牌别名" prop="alias"></el-table-column>
        <el-table-column label="品牌描述" prop="description"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.logo"
              fit="cover"
              :preview-src-list="[scope.row.logo]"
              :preview-teleported="true"
              :hide-on-click-modal="false"
              show-progress
              lazy
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort_order"></el-table-column>
        <el-table-column label="品牌状态">
          <template #default="scope">
            <el-tag :type="scope.row.is_enabled === 1 ? 'success' : 'danger'">{{
              scope.row.is_enabled === 1 ? "启用" : "停用"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`您确认要删除品牌：${scope.row.name}吗?`"
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
    </el-card>

    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="600">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item
          label="品牌名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="品牌别名"
          :label-width="formLabelWidth"
          prop="alias"
        >
          <el-input v-model="form.alias" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="品牌LOGO"
          :label-width="formLabelWidth"
          prop="logo"
        >
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers="uploadHeader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.logo" :src="form.logo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon" size="20"
              ><Plus
            /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="品牌描述"
          :label-width="formLabelWidth"
          prop="description"
        >
          <el-input
            type="textarea"
            v-model.lazy="form.description"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="品牌网站"
          :label-width="formLabelWidth"
          prop="website"
        >
          <el-input v-model="form.website" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="品牌排序"
          :label-width="formLabelWidth"
          prop="sort_order"
        >
          <el-input v-model.number="form.sort_order" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="品牌状态"
          :label-width="formLabelWidth"
          prop="is_enabled"
        >
          <el-radio-group v-model="form.is_enabled">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  width: 100%;
}
.avatar-uploader-icon {
  width: 100px;
  height: 100px;
  border: 1px solid #dcdfe6;
}
</style>
