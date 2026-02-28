<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <div class="top">
        <ScreenTop />
      </div>
      <div class="bottom">
        <div class="left">
          <ScreenTourist class="tourist" />
          <ScreenSex class="sex" />
          <ScreenAge class="age" />
        </div>
        <div class="center">
          <Map class="map" />
          <Trend class="trend" />
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Counter class="count" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Screen">
import { ref, onMounted } from "vue";
// 引入顶部的子组件
import ScreenTop from "./components/top/index.vue";
// 引入左侧三个子组件
import ScreenTourist from "./components/left/tourist/index.vue";
import ScreenSex from "./components/left/sex/index.vue";
import ScreenAge from "./components/left/age/index.vue";
// 引入中间两个子组件
import Map from "./components/middle/map/index.vue";
import Trend from "./components/middle/trend/index.vue";
// 引入右侧三个子组件
import Rank from "./components/right/rank/index.vue";
import Year from "./components/right/year/index.vue";
import Counter from "./components/right/counter/index.vue";

// 获取数据大屏展示内容div的DOM元素
let screen = ref();

// 在onMounted生命周期钩子中，初始化缩放比例，并设置transform属性
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
});

// 计算缩放比例，默认以 1920x1080 为基准，根据当前窗口的宽高与基准宽高的比值，取较小者作为缩放比例（等比例缩放，避免内容超出视口）
// 默认设计稿就是 按 1920 * 1080 设计的 。如果你的设计稿是 750 * 680 则可以直接替换 getScale 的 w 和 h 参数
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
}

// 监听窗口的resize事件，当窗口大小改变时，重新计算缩放比例并应用
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
};
</script>

<style scoped lang="scss">
.container {
  /* 容器（container）占满整个视口（100vw, 100vh），背景图覆盖 */
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  /* 
  屏幕（screen）采用固定定位（fixed），初始宽高为1920x1080，定位在视口中心（left:50%, top:50%） 
  设置变换原点（transform-origin）为左上角，这是因为缩放时我们希望从左上角开始缩放，然后通过平移来居中
  */

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;

    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }

    /* 底部使用flex布局，分为左、中、右三列，其中中间部分占1.5份，左右各占1份 */
    .bottom {
      display: flex;
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        // margin-left: 40px;
        .rank {
          flex: 1.5;
        }
        .year {
          flex: 1;
        }
        .count {
          flex: 1;
        }
      }
      .left {
        flex: 1;
        width: calc(100% / 3.5);
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 1.5;
        display: flex;
        flex-direction: column;
        margin-top: 34px;
        // margin-left: 40px;
        .map {
          flex: 4;
          // background-color: blueviolet;
        }
        .trend {
          flex: 1;
          // background-color: yellow;
        }
      }
    }
  }
}
</style>
