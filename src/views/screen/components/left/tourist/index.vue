<template>
  <div class="tj">
    <div class="tj-top">
      <div class="ttl">
        <h4>实时游客统计</h4>
        <p><img src="../../../images/dataScreen-title.png" alt="" /></p>
      </div>
      <div class="ttr">
        可预约总量
        <span>99999</span>
        人
      </div>
    </div>
    <div class="tj-people">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"; // 导入Vue的组合式API：ref用于创建响应式数据，onMounted用于处理组件挂载后的逻辑
import * as echarts from "echarts"; // 导入echarts图表库的所有功能
import "echarts-liquidfill"; // 导入水球图插件，扩展echarts的水球图功能

const people = ref<string>("215908人");

// 要创建图表的 DOM 元素
const charts = ref<any>(); // 创建一个ref引用，用于存储图表容器的DOM元素，any类型表示不限制DOM元素类型

onMounted(() => {
  // 当组件挂载到DOM后执行的回调函数
  //设置实例的配置项
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value); // 初始化echarts实例，传入DOM元素，创建一个图表实例

  //设置实例的配置项
  mycharts.setOption({
    // 设置图表的配置选项
    //标题组件
    title: {
      // 图表标题配置
      text: "水球图", // 标题文本内容
    },
    //x|y轴组件
    xAxis: {}, // x轴配置（这里为空配置，水球图通常不需要坐标轴）
    yAxis: {}, // y轴配置（这里为空配置，水球图通常不需要坐标轴）

    //系列:决定你展示什么样的图形图标
    series: {
      // 系列配置，定义图表类型和数据
      type: "liquidFill", // 系列类型为水球图（由echarts-liquidfill插件提供）
      data: [0.6, 0.4, 0.2], // 水球图的数据，每个数值代表一个水球的填充比例（0-1之间）
      waveAnimation: true, // 是否启用波浪动画效果
      animationDuration: 3, // 动画持续时间（秒）
      animationDurationUpdate: 0, // 数据更新时的动画持续时间，0表示无动画
      radius: "90%", // 水球图的半径，相对于容器大小的百分比

      outline: {
        // 水球外边框配置
        //外层边框设置
        show: true, // 是否显示外边框
        borderDistance: 8, // 边框与水球之间的间距（像素）
        itemStyle: {
          // 边框样式配置
          color: "skyblue", // 边框颜色
          borderColor: "#294D99", // 边框线颜色
          borderWidth: 8, // 边框线宽度
          shadowBlur: 20, // 阴影模糊大小
          shadowColor: "rgba(0, 0, 0, 0.25)", // 阴影颜色
        },
      },
    },

    //布局组件
    grid: {
      // 图表网格布局配置
      left: 0, // 图表区域距离容器左侧的距离
      right: 0, // 图表区域距离容器右侧的距离
      top: 0, // 图表区域距离容器顶部的距离
      bottom: 0, // 图表区域距离容器底部的距离
    },
  });
});
</script>

<style scoped lang="scss">
$text-color: #29fcff;
.tj {
  margin-top: 10px;
  background: url("../../../images/dataScreen-main-lb.png") no-repeat
    center/cover;

  .tj-top {
    display: flex;
    justify-content: space-between;

    .ttl {
      color: white;
      font-size: 20px;
      margin-left: 15px;
    }
    .ttr {
      margin-top: 40px;
      color: white;
      font-size: 20px;
      span {
        color: green;
      }
    }
  }

  .tj-people {
    display: flex;
    margin-top: 16px;
    padding: 0 15px;
    height: 40px;

    span {
      flex: 1;
      background: url("../../../images/total.png") no-repeat center/cover;
      text-align: center;
      line-height: 40px;
      color: $text-color;
    }
  }

  .charts {
    width: 100%;
    height: 270px;
  }
}
</style>
