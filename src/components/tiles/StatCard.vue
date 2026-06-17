<script setup lang="ts">
import { useEditmodeStore } from '@/stores/editmode'

defineProps({
  id: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'fas fa-users',
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  changeValue: {
    type: String,
    required: true,
  },
  isUp: {
    type: Boolean,
    default: true,
  },
  periodText: {
    type: String,
    default: 'vs last week',
  },
  tone: {
    type: String,
    default: 'x1',
  },
})

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`
const emit = defineEmits(['remove'])
</script>

<template>
  <div
    :class="['card', `tone-${tone}`, editmodeStore.editmode ? 'editmode' : '']"
    :style="{ '--float-delay': randomFloatDelay }"
  >
    <i v-if="editmodeStore.editmode" class="close fa-solid fa-xmark" @click="emit('remove')"></i>
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

/* Large Value (e.g., "1,248") */
.metric-value {
  font-size: 19px;
  color: var(--font-color-dark);
  font-weight: 700;
  margin-top: 2px;
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
</style>
