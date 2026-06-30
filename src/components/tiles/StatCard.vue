<script setup lang="ts">
import { ref } from 'vue'
import { useEditmodeStore } from '@/stores/editmode'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import StatCardSettings from '@/views/sheets/StatCardSettings.vue'

defineProps({
  id: {
    type: String,
    required: false,
    default: () => `stat-card-${crypto.randomUUID()}`,
  },
  icon: {
    type: String,
    required: false,
    default: 'fas fa-users',
  },
  title: {
    type: String,
    required: false,
    default: 'Title',
  },
  value: {
    type: [String, Number],
    required: false,
    default: '0',
  },
  changeValue: {
    type: String,
    required: false,
    default: '0',
  },
  isUp: {
    type: Boolean,
    required: false,
    default: true,
  },
  periodText: {
    type: String,
    required: false,
    default: 'vs last week',
  },
  tone: {
    type: String,
    required: false,
    default: 'x1',
  },
  thumb: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`
const emit = defineEmits(['remove'])
const sheet = ref<{ open: () => void; close: () => void } | null>(null)
</script>

<template>
  <div
    :class="[
      'card',
      `tone-${tone}`,
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
    <div class="icon-container">
      <i :class="[icon, 'user-icon']"></i>
    </div>

    <div class="metric-title">{{ title }}</div>
    <div class="metric-value">{{ value }}</div>

    <div class="metric-change">
      <span class="trend-icon" :class="isUp ? 'up-arrow' : 'down-arrow'">
        <i :class="isUp ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
      </span>

      <span class="percentage">{{ changeValue }}</span>
      <span class="vs-text">{{ periodText }}</span>
    </div>
    <VueBottomSheet ref="sheet">
      <StatCardSettings :widgetId="id" @close="sheet?.close()" />
    </VueBottomSheet>
  </div>
</template>

<style scoped>
/* User Icon Styling */
.icon-container {
  background: rgba(255, 0, 0, 0.323);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
}

.user-icon {
  font-size: 14px;
}

.tone-x1 .icon-container {
  background-color: var(--x1-color-light);
}

.tone-x1 .user-icon,
.tone-x1 .trend-icon,
.tone-x1 .percentage {
  color: var(--x1-color-dark);
}

.tone-x2 .icon-container {
  background-color: var(--x2-color-light);
}
.tone-x2 .user-icon,
.tone-x2 .trend-icon,
.tone-x2 .percentage {
  color: var(--x2-color-dark);
}

.tone-x3 .icon-container {
  background-color: var(--x3-color-light);
}
.tone-x3 .user-icon,
.tone-x3 .trend-icon,
.tone-x3 .percentage {
  color: var(--x3-color-dark);
}

/* Metric Title (e.g., "Users") */
.metric-title {
  font-size: 12px;
  color: var(--font-color-light);
  margin-top: 10px;
  margin-bottom: 0;
  font-weight: 400;
  letter-spacing: -0.8px;
}

.thumb .metric-title {
  font-size: 10px;
  margin-top: 8px;
}

/* Large Value (e.g., "1,248") */
.metric-value {
  font-size: 19px;
  color: var(--font-color-dark);
  font-weight: 700;
  margin-top: 2px;
}

.thumb .metric-value {
  font-size: 16px;
  margin-top: 0px;
}

/* Change Indicator Container */
.metric-change {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 3px;
}

/* Trend Icon (The arrow) */
.trend-icon {
  font-size: 9px;
}

/* Percentage Change (+ 12%) */
.percentage {
  font-size: 9px;
  font-weight: 600;
}

/* VS Last Week Text */
.vs-text {
  font-size: 9px;
  color: var(--font-color-light);
}

.thumb .percentage,
.thumb .vs-text {
  font-size: 8px;
}
</style>
