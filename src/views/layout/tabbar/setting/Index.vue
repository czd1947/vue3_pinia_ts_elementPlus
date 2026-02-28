<template>
  <div>
    <el-button
      size="small"
      icon="Refresh"
      circle
      @click="handleRefresh"
    ></el-button>
    <el-button
      size="small"
      icon="FullScreen"
      circle
      @click="handleFullScreen"
    ></el-button>

    <el-popover placement="bottom" :width="300" trigger="click">
      <template #reference>
        <el-button size="small" icon="Setting" circle></el-button>
      </template>
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker
            v-model="color"
            show-alpha
            :predefine="predefineColors"
            @change="changeColor"
            size="small"
          />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            v-model="darkMode"
            class="ml-2"
            inline-prompt
            active-icon="MoonNight"
            inactive-icon="Sunny"
            @change="changeDarkMode"
          />
        </el-form-item>
      </el-form>
    </el-popover>

    <img :src="userStore.avatar || '/logo.png'" alt="" class="avatar" />
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goUserInfo">个人中心</el-dropdown-item>
          <el-dropdown-item @click="handleLogout">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="Setting">
import useSettingStore from "@/store/modules/setting";
import useUserStore from "@/store/modules/user";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
const layoutSettingStore = useSettingStore();
const userStore = useUserStore();
const router = useRouter();

// 刷新页面
const handleRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh;
};

// 点击全屏模式
const handleFullScreen = () => {
  //DOM对象的一个属性：可以用来判断当前是不是全屏的模式【全屏：true，不是全屏：false】
  let full = document.fullscreenElement;
  //切换成全屏
  if (!full) {
    //文档根节点的方法requestFullscreen实现全屏
    document.documentElement.requestFullscreen();
  } else {
    //退出全屏
    document.exitFullscreen();
  }
};

// 退出登录
const handleLogout = async () => {
  await userStore.logout();
  router.push("/login");
};

// 点击个人中心
const goUserInfo = () => {
  router.push("/userInfo");
};

// 主题颜色
const color = ref(layoutSettingStore.color || "rgba(19, 206, 102, 0.8)");
// 预定义颜色
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);
// 改变主题颜色
const changeColor = (val: string) => {
  layoutSettingStore.color = val;

  let html = document.documentElement;
  html.style.setProperty("--el-color-primary", val);
};

// 暗黑模式开关 (存储在浏览器缓存中)
const darkMode = ref<boolean>(layoutSettingStore.darkMode ?? false);
onMounted(() => {
  // 初始化暗黑模式
  changeDarkMode(layoutSettingStore.darkMode);
  // 初始化主题颜色
  changeColor(layoutSettingStore.color);
});

// 切换暗黑模式
const changeDarkMode = (val: boolean) => {
  layoutSettingStore.darkMode = val;
  darkMode.value = val;

  //获取HTML根节点
  let html = document.documentElement;
  // 设置HTML标签是否有类名dark
  val ? (html.className = "dark") : (html.className = "");
};
</script>

<style scoped lang="scss">
.avatar {
  width: 24px;
  height: 24px;
  margin: 0px 10px;
}
</style>
