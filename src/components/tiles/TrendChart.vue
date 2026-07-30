<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditmodeStore } from '@/stores/editmode'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import TrendChartSettings from '@/components/sheets/TrendChartSettings.vue'

defineProps({
  id: {
    type: String,
    required: false,
    default: () => `trend-chart-${crypto.randomUUID()}`,
  },
  title: {
    type: String,
    required: false,
    default: 'Overview',
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

// Generate an array of day names
function getDayNames(locale = navigator.language) {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(2026, 5, i + 1) // June 1-7, 2026
    const dayName = date.toLocaleDateString(locale, { weekday: 'short' })
    days.push(dayName)
  }
  return days
}
const days = getDayNames()
const todayName = computed(() => {
  return new Intl.DateTimeFormat(navigator.language, { weekday: 'short' }).format(new Date())
})

// --- Chart ---

const mockData = [60, 70, 67, 75, 80, 69, 85, 90, 88]
const highlightIndex = 3

const SVG_W = 300
const SVG_H = 128
const PAD_TOP = 18
const PAD_BOTTOM = 4
const TENSION = 0.17

type Point = { x: number; y: number }

const chartPoints = computed<Point[]>(() => {
  const minVal = Math.min(...mockData)
  const maxVal = Math.max(...mockData)
  const range = maxVal - minVal || 1
  return mockData.map((val, i) => ({
    x: (i / (mockData.length - 1)) * SVG_W,
    y: PAD_TOP + (1 - (val - minVal) / range) * (SVG_H - PAD_TOP - PAD_BOTTOM),
  }))
})

const linePath = computed(() => {
  const pts = chartPoints.value
  const first = pts[0]!
  let d = `M ${first.x},${first.y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!
    const cp1x = p1.x + (p2.x - p0.x) * TENSION
    const cp1y = p1.y + (p2.y - p0.y) * TENSION
    const cp2x = p2.x - (p3.x - p1.x) * TENSION
    const cp2y = p2.y - (p3.y - p1.y) * TENSION
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return d
})

const areaPath = computed(() => {
  const pts = chartPoints.value
  const last = pts[pts.length - 1]!
  const first = pts[0]!
  return `${linePath.value} L ${last.x},${SVG_H} L ${first.x},${SVG_H} Z`
})

const highlight = computed<Point>(() => chartPoints.value[highlightIndex]!)
</script>

<template>
  <div
    :class="[
      'card',
      'full',
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
    <div class="top">
      <div class="title">{{ title }}</div>
    </div>
    <div class="middle">
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="chart-area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--key-color-dark)" stop-opacity="0.18" />
            <stop offset="100%" stop-color="var(--key-color-dark)" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Area fill -->
        <path :d="areaPath" fill="url(#chart-area-gradient)" />

        <!-- Line -->
        <path
          :d="linePath"
          fill="none"
          stroke="var(--key-color-dark)"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Highlight dot -->
        <circle :cx="highlight.x" :cy="highlight.y" r="5" fill="var(--key-color-dark)" />
        <circle :cx="highlight.x" :cy="highlight.y" r="3" fill="white" />

        <!-- Tooltip -->
        <g :transform="`translate(${highlight.x}, ${highlight.y - 10})`">
          <rect
            x="-22"
            y="-20"
            width="44"
            height="18"
            rx="9"
            fill="white"
            filter="url(#tooltip-shadow)"
          />
          <text x="0" y="-7" text-anchor="middle" font-size="9" font-weight="600" fill="#22c55e">
            ↑ 18%
          </text>
          <filter id="tooltip-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.12)" />
          </filter>
        </g>
      </svg>
    </div>
    <div class="bottom">
      <div class="days">
        <div v-for="day in days" :key="day" class="day-name" :class="{ today: day === todayName }">
          {{ day }}
        </div>
      </div>
    </div>
    <VueBottomSheet ref="sheet">
      <TrendChartSettings :widgetId="id" @close="sheet?.close()" />
    </VueBottomSheet>
  </div>
</template>

<style scoped>
.middle {
  height: 128px;
  overflow: hidden;
}

.days {
  height: 14px;
  line-height: 14px;
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
}

.day-name {
  font-size: 8px;
  color: var(--font-color-light);
  padding: 0px 4px;
  border-radius: 8px;
}

.day-name.today {
  color: var(--white-color);
  background-color: var(--key-color-dark);
}

/* One slot horizontal */
@container card-individual (max-width: 180px) {
  .card .top,
  .card .bottom {
    display: none;
  }
}

/* Two slots horizontal */
@container card-individual (min-width: 181px) and (max-width: 300px) {
  .card .top,
  .card .bottom {
    display: block;
  }
}

/* Three slots horizontal */
@container card-individual (min-width: 301px) {
  .card .top,
  .card .bottom {
    display: block;
  }
}

/* One slot vertical */
@container card-individual (max-height: 300px) {
  .card .bottom {
    display: none;
  }
}
</style>
