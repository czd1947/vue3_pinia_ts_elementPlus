<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <h1>{{ title }}</h1>
          <h2>通用后台管理系统</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="formData.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="formData.password"
              :prefix-icon="Lock"
              show-password
              prop="password"
              class="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              @click="login"
              size="default"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Login">
import { reactive, onMounted, ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import useUserStore from "@/store/modules/user";
import { useRouter } from "vue-router";
import { getTime } from "@/utils/time";

const loading = ref(false);
const title = import.meta.env.VITE_APP_TITLE || "硅谷甄选";
const userStore = useUserStore();
const router = useRouter();

const formData = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    {
      required: true,
      min: 3,
      max: 20,
      message: "用户名长度必须在3到20位之间",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      min: 6,
      max: 12,
      message: "密码长度必须在6到12位之间",
      trigger: "blur",
    },
  ],
};

// 获取表单元素
const formRef = ref();

// 登录方法
const login = async () => {
  // 表单校验
  await formRef.value.validate();

  loading.value = true;

  try {
    // 登录失败会 会排除一个 Promise的异常对象
    await userStore.login(formData);

    loading.value = false;

    // 判断是否有 redirect 参数
    const redirect = router.currentRoute.value.query.redirect;
    if (redirect) {
      router.push(redirect as string);
    } else {
      router.push({ name: "layout" });
    }

    ElNotification({
      type: "success",
      title: `HI, ${getTime()}好`,
      message: "登录成功!",
    });
  } catch (error: any) {
    loading.value = false;

    ElMessage.error(error.message);
  }
};

onMounted(async () => {});
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat center/cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat center/cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }

    //设置密码框上下外边距
    .password {
      margin: 15px 0px;
    }
    // 设置提交按钮
    .login_btn {
      width: 100%;
    }
  }
}
</style>
