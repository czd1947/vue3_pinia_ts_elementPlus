<template>
  <div class="top">
    <div class="tl">
      <div class="btn" @click="goHome">首页</div>
    </div>
    <div class="tm">智慧商城可视化大数据平台</div>
    <div class="tr">
      <div class="btn1">统计报告</div>
      <div class="btn2">当前时间: {{ timeNow }}</div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ScreenTop">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
const $router = useRouter();
import moment from "moment";

const timer = ref<number>(0);
const timeNow = ref<string>(moment().format("YYYY年MM月DD日 HH:mm:ss"));
const goHome = () => {
  $router.push("/");
};

onMounted(() => {
  timer.value = setInterval(() => {
    timeNow.value = moment().format("YYYY年MM月DD日 HH:mm:ss");
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style scoped lang="scss">
// 定义公共变量
$text-color: #29fcff;
$header-common-height: 42px;

.top {
  width: 100%;
  display: flex;
  color: $text-color;
  font-size: 20px;
  .tl {
    flex: 1;
    height: $header-common-height;
    background: url("../../images/dataScreen-header-left-bg.png") no-repeat
      center/cover;
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 135px;
      line-height: $header-common-height;
      text-align: center;
      background: url("../../images/dataScreen-header-btn-bg-l.png") no-repeat
        center/cover;
      cursor: pointer;
    }
  }
  .tm {
    flex: 1.5;
    height: 74px;
    line-height: 74px;
    text-align: center;

    background: url("../../images/dataScreen-header-center-bg.png") no-repeat
      center/cover;
    font-size: 30px;
  }
  .tr {
    flex: 1;
    background: url(../../images/dataScreen-header-right-bg.png) no-repeat
      center/cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $header-common-height;
    line-height: $header-common-height;
    .btn1 {
      width: 135px;
      height: $header-common-height;
      background: url(../../images//dataScreen-header-btn-bg-r.png) no-repeat
        center/cover;
      text-align: center;
    }
  }
}
</style>
