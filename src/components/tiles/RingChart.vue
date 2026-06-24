<script setup lang="ts">
import { ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import apexchart from 'vue3-apexcharts'
import { useEditmodeStore } from '@/stores/editmode'

defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  series: {
    type: Object as () => Record<string, number>,
    required: true,
  },
  thumb: {
    type: Boolean,
    default: false,
  },
})

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`
const emit = defineEmits(['remove'])

const formatSeries = (series: Record<string, number>) => {
  return Object.values(series)
}

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
    lineCap: 'round',
  },
  colors: ['rgb(112, 65, 250)', 'rgb(173, 172, 254)'],
})
</script>

<template>
  <div
    :class="[
      'card',
      'double',
      !thumb && editmodeStore.editmode ? 'editmode' : '',
      thumb ? 'thumb' : '',
    ]"
    :style="{ '--float-delay': randomFloatDelay }"
  >
    <i
      v-if="!thumb && editmodeStore.editmode"
      class="close fa-solid fa-xmark"
      @click="emit('remove')"
    ></i>
    <apexchart
      type="radialBar"
      width="140"
      height="140"
      :options="chartOptions"
      :series="formatSeries(series)"
      style="width: 134px; margin-left: -26px; margin-top: -22px"
    />
    <div class="right">
      <div class="title">{{ title }}</div>
      <div class="percent">{{ formatSeries(series)[0] }}%</div>
      <div class="description">{{ Object.keys(series)[0] }}</div>
      <div class="percent">{{ formatSeries(series)[1] }}%</div>
      <div class="description">{{ Object.keys(series)[1] }}</div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
}

.right {
  width: 50%;
  text-align: right;
}

.percent {
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 0px;
}

.description {
  margin-top: 0px;
  font-size: 10px;
  color: var(--key-color-dark);
}

/* One slot horizontal */
@container card-individual (max-width: 180px) {
  .card .right {
    display: none;
  }
}

/* Two slots horizontal */
@container card-individual (min-width: 181px) and (max-width: 300px) {
  .card .right {
    display: block;
  }
}

.thumb.card {
  padding: 6px 10px;
}
</style>
