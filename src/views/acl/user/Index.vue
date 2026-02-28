<script setup lang="ts" name="AclUser">
import { ref, onMounted, reactive } from "vue";
import setting from "@/setting";
import { reqUserList, reqRoleList, reqSetUserRole } from "@/api/acl/user";
import type { Role } from "@/api/acl/role/type";
import type {
  User,
  UserListResponseData,
  UserListSearch,
  userForm,
} from "@/api/acl/user/type";
import { UrlParamUtil } from "@/utils/urlParamUtil";

const formInline = reactive<UserListSearch>({
  username: "",
  nickname: "",
  mobile: "",
  email: "",
  searchTime: "",
  status: false,
});

const shortcuts = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "最近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "最近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];

const onSubmit = () => {
  getUserList();
};

const userList = ref<User[]>([]);
const pageNo = ref<number>(setting.pageInfo.page);
const limit = ref<number>(setting.pageInfo.limit);
const total = ref<number>(0);
const background = ref<boolean>(true);
const sizeChange = (currentPage: number, pageSize: number) => {
  limit.value = pageSize;
  pageNo.value = currentPage;

  getUserList();
};

onMounted(() => {
  getUserList();
  getRoleList();
});

const getUserList = async () => {
  const params = UrlParamUtil.stringify({
    ...formInline,
    pageNo: pageNo.value,
    limit: limit.value,
  });

  const res: UserListResponseData = await reqUserList(params.toString());
  if (res.code === 200) {
    userList.value = res.data.data;
    total.value = res.data.total;
  }
};

const dialog = ref(false);
const loading = ref(false);
const title = ref<string>("添加用户");
const formLabelWidth = ref<string>("100px");
const form = ref<userForm>({
  username: "",
  nickname: "",
  mobile: "",
  email: "",
  password: "",
  repeatPassword: "",
  status: 1,
});
const rules = reactive({
  username: [
    {
      required: true,
      min: 6,
      max: 100,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
});
const formRef = ref();

const cancelForm = () => {
  loading.value = false;
  dialog.value = false;
};
const onClick = async () => {
  await formRef.value?.validate();
  // 密码校验
  loading.value = true;
};

const addUser = () => {
  dialog.value = true;
  title.value = "添加用户";
  loading.value = false;
  formRef.value?.clearValidate();
  Object.assign(form.value, {
    username: "",
    nickname: "",
    mobile: "",
    email: "",
    password: "",
    repeatPassword: "",
    status: 1,
  });
};

const editUser = (row: User) => {
  dialog.value = true;
  title.value = "编辑用户";
  loading.value = false;
  formRef.value?.clearValidate();
  Object.assign(form.value, {
    password: "",
    repeatPassword: "",
    status: 1,
    ...row,
  });
};

const deleteUser = async (row: User) => {
  // 删除用户
};

const getRoleList = async () => {
  const res = await reqRoleList();
  if (res.code === 200) {
    roleList.value = res.data;
  }
};
const roleList = ref<Role[]>([]);
const dialogRole = ref(false);
const formRole = ref({
  ulid: "",
  username: "",
  roleId: 0,
});
const assignRole = (row: User) => {
  // 分配角色
  dialogRole.value = true;
  loading.value = false;
  Object.assign(formRole.value, {
    ulid: row.ulid,
    username: row.username,
    roleId: row.roles?.[0]?.id || null,
  });
};

const onReset = () => {
  Object.assign(formInline, {
    username: "",
    nickname: "",
    mobile: "",
    email: "",
    searchTime: "",
    status: false,
  });
};

const onSubmitRole = async () => {
  if (!formRole.value.roleId) {
    ElMessage.error("请选择角色");
    return;
  }

  const res = await reqSetUserRole(formRole.value);
  if (res.code === 200) {
    ElMessage.success("分配角色成功");
    dialogRole.value = false;
    getUserList();
  } else {
    ElMessage.error(res.message);
  }
};
</script>

<template>
  <div>
    <!-- 查询区 -->
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input
            v-model="formInline.username"
            placeholder="用户名"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="formInline.nickname"
            placeholder="昵称"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="formInline.mobile"
            placeholder="手机号"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="formInline.email"
            placeholder="邮箱"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="formInline.searchTime"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            size="default"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onReset">重置</el-button>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card style="margin-top: 10px">
      <el-button
        type="primary"
        icon="Plus"
        @click="addUser"
        v-has="'btn:User:add'"
        >添加用户</el-button
      >
      <el-table border style="margin: 10px 0px" :data="userList">
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="别名" prop="nickname"></el-table-column>
        <el-table-column label="角色" prop="roles">
          <template #="{ row }">
            {{ row.roles.map((item: Role) => item.display_name).join("、") }}
          </template>
        </el-table-column>
        <el-table-column label="头像" prop="avatar">
          <template #="{ row }">
            <el-image
              :src="row.avatar"
              fit="fill"
              :preview-src-list="[row.avatar]"
            />
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="创建时间" prop="created_at"></el-table-column>
        <el-table-column
          label="最后登录时间"
          prop="last_login_at"
        ></el-table-column>
        <el-table-column
          label="最后登录IP"
          prop="last_login_ip"
        ></el-table-column>
        <el-table-column label="操作" width="140px">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="editUser(row)"
              v-has="'btn:User:edit'"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="assignRole(row)"
              v-has="'btn:User:assign:role'"
            >
              分配角色
            </el-button>
            <el-popconfirm :title="`确认删除用户${row.username}吗？`">
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteUser(row)"
                  v-has="'btn:User:del'"
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

    <!-- 新增修改 -->
    <el-drawer
      v-model="dialog"
      :title="title"
      direction="rtl"
      class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" ref="formRef" :rules="rules">
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input v-model="form.username" autocomplete="off" />
          </el-form-item>
          <el-form-item
            label="昵称"
            :label-width="formLabelWidth"
            prop="nickname"
          >
            <el-input v-model="form.nickname" autocomplete="off" />
          </el-form-item>
          <el-form-item
            label="手机号"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="form.mobile" autocomplete="off" />
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="重复密码" :label-width="formLabelWidth">
            <el-input v-model="form.repeatPassword" autocomplete="off" />
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-radio-group v-model="form.status">
              <el-radio :label="1" :value="1">正常</el-radio>
              <el-radio :label="0" :value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" :loading="loading" @click="onClick">
            {{ loading ? "提交中 ..." : "提交" }}
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 分配角色 -->
    <el-drawer
      v-model="dialogRole"
      title="分配角色"
      direction="rtl"
      class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="formRole.username" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="选择角色" :label-width="formLabelWidth">
            <el-select
              v-model="formRole.roleId"
              placeholder="请选择角色"
              style="width: 240px"
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.display_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="dialogRole = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="onSubmitRole">
            {{ loading ? "提交中 ..." : "提交" }}
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped></style>
