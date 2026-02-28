<script setup lang="ts" name="AclPermission">
import {
  getPermissionList,
  switchPermission,
  addPermission,
  updatePermission,
  deletePermission,
} from "@/api/acl/permission";
import type {
  PermissionListResponseData,
  Permission,
  CommonResponseData,
  PermissionFormData,
} from "@/api/acl/permission/type";
import { ref, onMounted, reactive } from "vue";

const tableData = ref<Permission[]>([]);

const getPermissionListData = async () => {
  const res: PermissionListResponseData = await getPermissionList("");
  if (res.success && res.code === 200) {
    tableData.value = res.data;
  }
};

const handleSwitchChange = async (row: Permission) => {
  const res: CommonResponseData = await switchPermission({
    id: row.id as number,
    is_enabled: row.is_enabled,
  });
  if (res.success && res.code === 200) {
    ElMessage.success(res.message);
  } else {
    ElMessage.error(res.message);
  }
};

onMounted(() => {
  getPermissionListData();
});

// 表单
const dialogFormVisible = ref(false);
const formLabelWidth = "80px";
const title = ref<string>("新增权限");
const form: PermissionFormData = reactive({
  id: 0,
  parent_id: 0,
  name: "",
  display_name: "",
  type: 1,
  sort_order: 50,
  is_enabled: 1,
  route: "",
});

const addPermissionBtn = (parent_id: number = 0, type: number = 1) => {
  dialogFormVisible.value = true;
  title.value = "新增权限";

  Object.assign(form, {
    id: 0,
    parent_id,
    name: "",
    display_name: "",
    type,
    sort_order: 50,
    is_enabled: 1,
    route: "",
  });
};

const editPermissionBtn = (row: Permission) => {
  dialogFormVisible.value = true;
  title.value = "编辑权限";

  Object.assign(form, row);
};

const delPermissionBtn = async (row: Permission) => {
  const res: CommonResponseData = await deletePermission(row.id as number);
  if (res.success && res.code === 200) {
    ElMessage.success(res.message);
    getPermissionListData();
  } else {
    ElMessage.error(res.message);
  }
};

const isLoading = ref(false);
const formRef = ref();
const rules = {
  name: [{ required: true, message: "请输入权限标识", trigger: "blur" }],
  display_name: [
    { required: true, message: "请输入权限名称", trigger: "blur" },
  ],
  type: [{ required: true, message: "请选择权限类型", trigger: "change" }],
};

const submitForm = async () => {
  formRef.value.validate();

  if (isLoading.value) {
    ElMessage.warning("正在提交，请稍后再试");
    return;
  }
  const loadingInstance = ElLoading.service({
    lock: true,
    fullscreen: true,
    text: "数据处理中...",
    background: "rgba(0, 0, 0, 0.7)", // 可选：调深背景，文字更清晰
  });
  isLoading.value = true;

  // 发请求
  let res: CommonResponseData;
  if (form.id === 0) {
    // 新增
    res = await addPermission(form);
  } else {
    // 更新
    res = await updatePermission(form);
  }
  if (res.success && res.code === 200) {
    ElMessage.success(res.message);
    dialogFormVisible.value = false;
    getPermissionListData();
  } else {
    ElMessage.error(res.message);
  }

  isLoading.value = false;
  loadingInstance.close();
};
</script>

<template>
  <div>
    <el-card>
      <el-button type="primary" @click="addPermissionBtn(0, 1)"
        >新增菜单</el-button
      >
      <el-table
        :data="tableData"
        style="width: 100%; margin: 10px 0 20px"
        row-key="id"
        border
      >
        <el-table-column prop="display_name" label="权限名称" width="200px" />
        <el-table-column prop="name" label="权限标识" />
        <el-table-column prop="type_txt" label="类型">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 1" type="primary">
              {{ scope.row.type_txt }}
            </el-tag>
            <el-tag v-else-if="scope.row.type === 2" type="success">
              {{ scope.row.type_txt }}
            </el-tag>
            <el-tag v-else type="warning">
              {{ scope.row.type_txt }}
            </el-tag>
            {{ scope.row.route }}
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="排序"></el-table-column>
        <el-table-column prop="is_enabled" label="是否显示">
          <template #="{ row }">
            <el-switch
              v-model="row.is_enabled"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              @change="handleSwitchChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              v-if="scope.row.type === 1"
              @click="addPermissionBtn(scope.row.id, 1)"
            >
              添加菜单或按钮
            </el-button>
            <el-button
              type="success"
              size="small"
              v-if="scope.row.type === 2"
              @click="addPermissionBtn(scope.row.id, 3)"
            >
              添加数据权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="editPermissionBtn(scope.row)"
            >
              编辑
            </el-button>

            <el-popconfirm
              :title="`确认删除“${scope.row.display_name}”吗?`"
              @confirm="delPermissionBtn(scope.row)"
            >
              <template #reference>
                <el-button type="danger" size="small"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加或删除弹窗表单 -->
    <el-dialog v-model="dialogFormVisible" :title="title" width="500">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item
          prop="display_name"
          label="权限名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.display_name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          prop="name"
          label="权限标识"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="type" label="类型" :label-width="formLabelWidth">
          <el-radio-group v-model="form.type">
            <el-radio
              label="1"
              :value="1"
              v-if="form.type === 1 || form.type === 2"
              >菜单</el-radio
            >
            <el-radio
              label="2"
              :value="2"
              v-if="
                (form.type === 1 || form.type === 2) && form.parent_id !== 0
              "
              >按钮</el-radio
            >
            <el-radio label="3" :value="3" v-if="form.type === 3"
              >数据权限</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="路由地址" :label-width="formLabelWidth">
          <el-input v-model="form.route" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="form.sort_order"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="是否显示" :label-width="formLabelWidth">
          <el-switch
            v-model="form.is_enabled"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
