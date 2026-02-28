<template>
  <div ref="main"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import "echarts-gl";

var ROOT_PATH = "/src/views/screen/images/echarts";
let main = ref();

onMounted(() => {
  var myChart = echarts.init(main.value);
  var option;

  option = {
    backgroundColor: "#000",
    globe: {
      baseTexture: ROOT_PATH + "/world.topo.bathy.200401.jpg",
      heightTexture: ROOT_PATH + "/world.topo.bathy.200401.jpg",
      displacementScale: 0.04,
      shading: "realistic",
      environment: ROOT_PATH + "/starfield.jpg",
      realisticMaterial: {
        roughness: 0.9,
      },
      postEffect: {
        enable: true,
      },
      light: {
        main: {
          intensity: 5,
          shadow: true,
        },
        ambientCubemap: {
          texture: ROOT_PATH + "/pisa.hdr",
          diffuseIntensity: 0.2,
        },
      },
    },
  };

  option && myChart.setOption(option);
});
</script>

<style scoped lang="scss"></style>
