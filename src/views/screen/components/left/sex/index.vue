<template>
  <div class="sex-box">
    <div class="sex-top">
      <h4>男女比例</h4>
      <p><img src="../../../images/dataScreen-title.png" alt="" /></p>
    </div>
    <div class="sex-avatar">
      <div class="sa-item">
        <div class="boy-avatar">
          <img src="../../../images/man.png" alt=""></img>
        </div>
        <div class="txt">男士58%</div>
      </div>
      <div class="sa-item">
        <div class="girl-avatar">
          <img src="../../../images/woman.png" alt=""></img>
        </div>
        <div class="txt">女士42%</div>
      </div>
    </div>

    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup name="ScreenAge">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const charts = ref()
onMounted(() => { 
  let mycharts = echarts.init(charts.value)
  
  // 设置配置项
  mycharts.setOption({
    //组件标题
    title: {
      //   text: '男女比例', //主标题
      textStyle: {
        //主标题颜色
        color: 'skyblue',
      },
      left: '40%',
    },
    //x|y
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      // 这里有俩个柱状图，下面的覆盖上面的
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        // 柱状图的层级
        z: 100,
        // 柱状图样式
        itemStyle: {
          color: 'skyblue',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        // 柱状图宽度
        barWidth: 20,
        // 调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style lang="scss" scoped>
.sex-box {
  margin-top: 10px;
  background: url('../../../images/dataScreen-main-lb.png') no-repeat
    center/cover;

  .sex-top {
    color: white;
    font-size: 20px;
    margin-left: 15px;
  }
  .sex-avatar {
    display: flex;
    justify-content: space-between;
    padding: 20px 180px 0;

    .sa-item {
      width: 111px;
      text-align: center;

      .boy-avatar {
        height: 116px;
        padding-top: 30px;
        background: url(../../../images/man-bg.png) no-repeat center/cover;
      }
      .girl-avatar {
        height: 116px;
        padding-top: 30px;
        background: url(../../../images/woman-bg.png) no-repeat center/cover;
      }
      .txt {
        color: white;
        font-size: 16px;
        margin-top: 25px;
      }
    }
  }
  .charts {
    box-sizing: border-box;
    padding: 0 50px;
    height: 100px;
  }
  
}
</style>
