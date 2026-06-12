<script setup lang="ts">
import { ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import apexchart from 'vue3-apexcharts'

const series = ref([80, 30]) 

const chartOptions = ref<ApexOptions>({
  chart: {
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '20%',
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        },
        total: {
          show: false,
        },
      },
      track: {
        strokeWidth: '100%',
      },
    },
  },
  stroke: {
    lineCap: 'round'
  },
  colors: ['rgb(112, 65, 250)', 'rgb(173, 172, 254)'],
})
</script>

<template>
  <div class="card double">
    <apexchart 
      type="radialBar" 
      width="140"
      height="140" 
      :options="chartOptions" 
      :series="series"
      style="width: 134px; margin-left: -26px; margin-top: -22px;"
    />
    <div>
      <h3 style="font-size: 18px; font-weight: 500; margin-bottom: 4px;">80%</h3>
      <p style="font-size: 14px; color: rgb(112, 65, 250);">Completed</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
}
</style>
