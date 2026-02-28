<template>
  <el-card class="profile-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
        <el-text class="edit-hint" size="small" type="info"
          >可编辑以下信息</el-text
        >
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-position="right"
      status-icon
    >
      <!-- 只读用户名（账号） -->
      <el-form-item label="用户名">
        <el-text>{{ originData.username }}</el-text>
      </el-form-item>

      <!-- 头像上传 -->
      <el-form-item label="头像" prop="avatar">
        <div class="avatar-wrapper">
          <el-avatar :size="70" :src="form.avatar" class="avatar">
            <el-icon><UserFilled /></el-icon>
          </el-avatar>
          <el-upload
            ref="uploadRef"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            :accept="'image/png, image/jpeg, image/jpg, image/gif'"
            class="upload-btn"
          >
            <el-button type="primary" plain size="small">
              <el-icon><Upload /></el-icon>上传头像
            </el-button>
          </el-upload>
        </div>
        <div class="upload-tip">支持 jpg/png/gif，不超过 2MB</div>
      </el-form-item>

      <!-- 两列布局：昵称 & 性别 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input
              v-model="form.nickname"
              placeholder="请输入昵称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 两列布局：手机号 & 邮箱 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="form.mobile"
              placeholder="请输入手机号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 密码 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              clearable
              type="password"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="确认密码" prop="password_confirmation">
            <el-input
              v-model="form.password_confirmation"
              placeholder="请确认密码"
              clearable
              type="password"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          保存修改
        </el-button>
        <el-button @click="resetForm">取消重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" name="UserInfo">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import type { UploadInstance, UploadFile, UploadProps } from "element-plus";
import {
  reqUserDetail,
  reqUserDetailUpdate,
  reqUploadAvatar,
} from "@/api/user";
import type {
  UserDetail,
  UserDetailResponseData,
  UserDetailUpdateFormData,
  UserDetailUpdateResponseData,
} from "@/api/user/type";
import useUserStore from "@/store/modules/user";
import { useRouter } from "vue-router";

const originData: UserDetail = reactive({
  username: "",
  avatar: "", // 空字符串时显示默认图标
  nickname: "",
  mobile: "",
  email: "",
});

// 表单数据（可编辑）
const form = reactive<UserDetailUpdateFormData>({
  username: "",
  avatar: "", // 空字符串时显示默认图标
  nickname: "",
  mobile: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const getUserDetail = async () => {
  const res: UserDetailResponseData = await reqUserDetail();
  if (res.code === 200) {
    Object.assign(originData, res.data);
    Object.assign(form, res.data);
  }
};

const userStore = useUserStore();
const $router = useRouter();

const uploadHeader = {
  Authorization: userStore.token,
};

onMounted(() => {
  getUserDetail();
});

// 表单引用
const formRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const submitting = ref(false);

// ---------- 表单校验规则 ----------
const validateMobile = (_rule: any, value: string, callback: any) => {
  const mobileRegex = /^1[3-9]\d{9}$/;
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!mobileRegex.test(value)) {
    callback(new Error("手机号格式不正确"));
  } else {
    callback();
  }
};

const rules: FormRules = {
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  mobile: [{ required: true, validator: validateMobile, trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
};

// ---------- 头像上传处理 ----------
const handleAvatarChange = async (uploadFile: UploadFile) => {
  const rawFile = uploadFile.raw;
  if (!rawFile) return;

  // 校验图片类型和大小
  const isImage = rawFile.type.startsWith("image/");
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片文件");
    uploadRef.value?.clearFiles();
    return;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB");
    uploadRef.value?.clearFiles();
    return;
  }

  // 创建 FormData 对象
  const formData = new FormData();
  formData.append("file", rawFile);

  try {
    // 发起图片上传请求
    const result = await reqUploadAvatar(formData);
    if (result.code === 401) {
      ElMessage.error("登录失效，请重新登录！");
      userStore.logout();
      $router.push({
        path: "/login",
        query: { redirect: $router.currentRoute.value.path },
      });
      return;
    } else if (result.code === 200) {
      // 上传成功，更新头像 URL
      form.avatar = result.data.url;
      ElMessage.success("头像上传成功");
    } else {
      ElMessage.error(result.message || "头像上传失败");
    }
  } catch (error) {
    ElMessage.error("头像上传失败，请重试");
  }

  // 清除 upload 组件内部文件列表，避免干扰
  uploadRef.value?.clearFiles();
};

// ---------- 重置表单至原始数据 ----------
const resetForm = () => {
  // 将 originData 的值赋给 form（注意 birthday 是字符串，无需特殊处理）
  form.avatar = originData.avatar;
  form.nickname = originData.nickname;
  form.mobile = originData.mobile;
  form.email = originData.email;
  form.username = originData.username;

  // 清除校验状态
  formRef.value?.clearValidate();

  // 如果有上传暂存的文件，也清空
  uploadRef.value?.clearFiles();

  ElMessage.info("已重置为原始数据");
};

// ---------- 提交保存 ----------
const submitForm = async () => {
  await formRef.value?.validate();

  // 发送请求
  const res: UserDetailUpdateResponseData = await reqUserDetailUpdate(form);
  if (res.code === 200) {
    ElMessage.success("个人信息修改成功");

    // 密码修改后，需要重新登录
    if (form.password) {
      ElMessage.success("密码修改成功，需重新登录！");
      setTimeout(async () => {
        // 退出登录
        await userStore.logout();
        $router.push({
          path: "/login",
          query: { redirect: $router.currentRoute.value.path },
        });
      }, 1000);
    }
  } else {
    ElMessage.error(res.message || "个人信息修改失败");
  }
};
</script>

<style scoped lang="scss">
.profile-card {
  // max-width: 100%;
  margin: 0 auto;
  border-radius: 12px;
  transition: all 0.3s;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 16px;
}

.edit-hint {
  font-weight: normal;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.avatar {
  border: 2px solid #f0f2f5;
  background-color: #fafafa;
  flex-shrink: 0;
}

.upload-btn {
  display: inline-block;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  margin-left: 90px; /* 与label对齐，简单处理 */
}

@media (max-width: 640px) {
  .avatar-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .upload-tip {
    margin-left: 0;
  }
}
</style>
