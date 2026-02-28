<script setup lang="ts" name="AclRole">
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  getPermissionIdsByRoleId,
  setPermissionIdsByRoleId,
} from "@/api/acl/role";
import type {
  RoleListSearch,
  Role,
  RoleListResponseData,
  RoleCreateOrUpdateResponseData,
  RoleAssignPermissionResponseData,
  CommonResponseData,
  AssignPermission,
} from "@/api/acl/role/type";
import setting from "@/setting";
import { getPermissionList } from "@/api/acl/permission";
import type {
  Permission,
  PermissionListResponseData,
} from "@/api/acl/permission/type";

const formInline = ref<RoleListSearch>({
  name: "",
  display_name: "",
});

const pageNo = ref<number>(setting.pageInfo.page);
const limit = ref<number>(setting.pageInfo.limit);
const total = ref<number>(0);
const background = ref<boolean>(true);
const sizeChange = (currentPage: number, pageSize: number) => {
  limit.value = pageSize;
  pageNo.value = currentPage;

  getList();
};

const roleList = ref<Role[]>([]);

const onSubmit = () => {
  getList();
};

const getList = async () => {
  const params = new URLSearchParams(formInline.value);
  params.append("page", pageNo.value.toString());
  params.append("limit", limit.value.toString());

  const res: RoleListResponseData = await getRoleList(params.toString());
  if (res.success) {
    roleList.value = res.data?.data || [];
    total.value = res.data?.total || 0;
  }
};

const initPermissionList = async () => {
  const res: PermissionListResponseData = await getPermissionList("");

  if (res.code === 200) {
    permissionList.value = res.data || [];
  }
};

onMounted(() => {
  getList();
  initPermissionList();
});

const addRole = () => {
  dialogFormVisible.value = true;
  title.value = "添加角色";
  form.id = 0;
  form.name = "";
  form.display_name = "";
  form.description = "";

  nextTick(() => {
    dialogFormRef.value.clearValidate();
  });
};

const editRole = (role: Role) => {
  // 打开编辑角色弹窗
  dialogFormVisible.value = true;
  title.value = "编辑角色";
  Object.assign(form, role);

  nextTick(() => {
    dialogFormRef.value.clearValidate();
  });
};

const title = ref<string>("添加角色");
const dialogFormVisible = ref(false);
const formLabelWidth = "80px";
const dialogFormRef = ref();
const rules = {
  name: [{ required: true, message: "请输入角色标识", trigger: ["blur"] }],
  display_name: [
    {
      required: true,
      min: 2,
      max: 50,
      message: "请输入角色名称",
      trigger: ["blur"],
    },
  ],
};

const nameStatus = ref<boolean>(false);
const form = reactive<Role>({
  id: 0,
  name: "",
  display_name: "",
  description: "",
});

// 提交表单
const submitForm = async () => {
  await dialogFormRef.value.validate();

  // 发送请求
  let res: RoleCreateOrUpdateResponseData;
  if (form.id) {
    // 更新角色
    res = await updateRole(form);
  } else {
    // 添加角色
    res = await createRole(form);
  }
  if (res.success && res.code === 200) {
    ElMessage.success(title.value + "成功");
    getList();
  } else {
    ElMessage.error(res.message || "操作失败");
  }

  dialogFormVisible.value = false;
};

// 删除角色
const deleteRoleById = async (id: number) => {
  const res: RoleCreateOrUpdateResponseData = await deleteRole(id);
  if (res.success && res.code === 200) {
    ElMessage.success("删除角色成功");
    getList();
  } else {
    ElMessage.error(res.message || "删除角色失败");
  }
};

const rowStyle = ({ row }: { row: Role }) => {
  if (row.name === "admin") {
    return {
      background: background.value ? "#f5f7fa" : "transparent",
    };
  }
  return {};
};

const selectable = (row: Role) => !["admin"].includes(row.name);

// 分配权限
const permissionList = ref<Permission[]>([]);
const assignPermissionForm = reactive<AssignPermission>({
  role_id: 0,
  display_name: "",
  permissionIds: [],
});
const dialogAssignPermissionFormVisible = ref(false);
const defaultProps = {
  children: "children",
  label: "display_name",
};

const treeRef = ref();
const clickAssignPermission = async (role: Role) => {
  dialogAssignPermissionFormVisible.value = true;
  Object.assign(assignPermissionForm, {
    role_id: role.id,
    display_name: role.display_name,
    permissionIds: [],
  });

  const res1: RoleAssignPermissionResponseData = await getPermissionIdsByRoleId(
    role.id as number,
  );
  if (res1.code === 200) {
    // assignPermissionForm.permissionIds = res1.data || [];
    // 手动更新树形组件的选中状态
    nextTick(() => {
      if (treeRef.value) {
        treeRef.value.setCheckedKeys(res1.data || []);
      }
    });
  }
};

// 提交分配权限表单
const submitAssignPermissionForm = async (role_id: number) => {
  const checkedKeys = treeRef.value?.getCheckedKeys(false); // 全选的 key
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys(); // 半选的 key
  const allCheckKeys = [...checkedKeys, ...halfCheckedKeys];

  const res: CommonResponseData = await setPermissionIdsByRoleId(
    role_id,
    allCheckKeys,
  );
  if (res.code === 200) {
    ElMessage.success("分配权限成功");
  } else {
    ElMessage.error(res.message || "分配权限失败");
  }

  dialogAssignPermissionFormVisible.value = false;
};
</script>

<template>
  <div>
    <!-- 查询区 -->
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="角色标识">
          <el-input
            v-model="formInline.name"
            placeholder="角色标识"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input
            v-model="formInline.display_name"
            placeholder="角色名称"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card style="margin-top: 10px">
      <el-button type="primary" icon="Plus" @click="addRole">
        添加角色
      </el-button>

      <el-table
        border
        style="margin: 10px 0px"
        :data="roleList"
        :row-style="rowStyle"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" />
        <el-table-column label="角色标识" prop="name"></el-table-column>
        <el-table-column label="角色名称" prop="display_name" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作" width="220px">
          <template #default="scope">
            <el-button
              v-if="selectable(scope.row)"
              type="success"
              size="small"
              @click="clickAssignPermission(scope.row)"
            >
              分配权限
            </el-button>
            <el-button
              v-if="selectable(scope.row)"
              type="primary"
              size="small"
              @click="editRole(scope.row)"
            >
              编辑
            </el-button>

            <el-popconfirm
              :title="`确认删除角色${scope.row.name}吗？`"
              @confirm="deleteRoleById(scope.row.id)"
            >
              <template #reference>
                <el-button
                  v-if="selectable(scope.row)"
                  type="danger"
                  size="small"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="setting.pageInfo.pageSizes"
        :background="background"
        :layout="setting.pageInfo.layout"
        :total="total"
        @change="sizeChange"
      />
    </el-card>

    <!-- 新增或修改表单 -->
    <el-dialog v-model="dialogFormVisible" :title="title" width="500">
      <el-form
        :model="form"
        ref="dialogFormRef"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item
          label="角色标识"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            :disabled="form.id !== 0"
          />
        </el-form-item>
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="display_name"
        >
          <el-input v-model="form.display_name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="描述"
          :label-width="formLabelWidth"
          prop="description"
        >
          <el-input
            type="textarea"
            v-model="form.description"
            autocomplete="off"
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

    <!-- 分配权限 -->
    <el-dialog
      v-model="dialogAssignPermissionFormVisible"
      title="分配权限"
      width="500"
    >
      <el-form :model="assignPermissionForm">
        <el-form-item label="当前角色" :label-width="formLabelWidth">
          <el-input
            v-model="assignPermissionForm.display_name"
            autocomplete="off"
            disabled
          />
        </el-form-item>
        <el-form-item label="权限列表" :label-width="formLabelWidth">
          <el-tree
            ref="treeRef"
            style="max-width: 600px; margin-top: 5px"
            :data="permissionList"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :check-strictly="true"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogAssignPermissionFormVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitAssignPermissionForm(assignPermissionForm.role_id)"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
