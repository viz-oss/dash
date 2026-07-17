<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import apexchart from 'vue3-apexcharts'
import { useEditmodeStore } from '@/stores/editmode'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import RingChartSettings from '@/views/sheets/RingChartSettings.vue'
import { parseVariables } from '@/utils/varParser'
import { parseCurlToFetch } from '@/utils/curlParser'
import { useRequest } from '@/composables/useRequest'

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: () => `ring-chart-${crypto.randomUUID()}`,
  },
  title: {
    type: String,
    required: false,
    default: 'Ring Chart',
  },
  max: {
    type: String,
    required: false,
    default: '100',
  },
  name1: {
    type: String,
    required: false,
    default: 'A',
  },
  value1: {
    type: String,
    required: false,
    default: '0',
  },
  name2: {
    type: String,
    required: false,
    default: 'B',
  },
  value2: {
    type: String,
    required: false,
    default: '0',
  },
  url: {
    type: String,
    required: false,
    default: '',
  },
  thumb: {
    type: Boolean,
    default: false,
  },
})

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`
const emit = defineEmits(['remove'])
const sheet = ref<{ open: () => void; close: () => void } | null>(null)

const { url, options } = parseCurlToFetch(props.url)
const { data, error, isFetching } = useRequest(url, options)

const showTitle = computed(() => parseVariables(props.title, data.value as Record<string, unknown>))
const showMax = computed(() => parseVariables(props.max, data.value as Record<string, unknown>))
const showName1 = computed(() => parseVariables(props.name1, data.value as Record<string, unknown>))
const showValue1 = computed(() => parseVariables(props.value1, data.value as Record<string, unknown>))
const showName2 = computed(() => parseVariables(props.name2, data.value as Record<string, unknown>))
const showValue2 = computed(() => parseVariables(props.value2, data.value as Record<string, unknown>))

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

const normalizeToPercent = (value: string, max: string): number => {
  const numericValue = parseFloat(value)
  const numericMax = parseFloat(max)

  if (!Number.isFinite(numericValue) || !Number.isFinite(numericMax) || numericMax <= 0) {
    return 0
  }

  const normalized = (numericValue / numericMax) * 100
  return Math.min(100, Math.max(0, normalized))
}

const chartSeries = computed(() => [
  normalizeToPercent(showValue1.value, showMax.value),
  normalizeToPercent(showValue2.value, showMax.value),
])
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
    @click="!thumb && editmodeStore.editmode ? sheet?.open() : null"
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
      :series="chartSeries"
      style="width: 134px; margin-left: -26px; margin-top: -22px"
    />
    <div class="right">
      <div class="title">{{ showTitle }}</div>
      <div class="percent" :title="showValue1">{{ showValue1 }}</div>
      <div class="description">{{ showName1 }}</div>
      <div class="percent" :title="showValue2">{{ showValue2 }}</div>
      <div class="description">{{ showName2 }}</div>
    </div>
    <VueBottomSheet ref="sheet">
      <RingChartSettings :widgetId="id" @close="sheet?.close()" />
    </VueBottomSheet>
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
