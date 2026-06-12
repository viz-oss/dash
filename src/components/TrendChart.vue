<script setup lang="ts">
import { computed } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Overview',
  },
})

// type TimeUnit = 'hour' | 'day' | 'week' | 'month' | 'year';
// const selectedTimeUnit = ref<TimeUnit>('day');

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
</script>

<template>
  <div class="card full trend-chart">
    <div class="top">
      <div class="title">{{ title }}</div>
    </div>
    <div
      class="middle"
      style="
        background-image: url('public/_concept-wave-graph.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      "
    ></div>
    <div class="bottom">
      <div class="days">
        <div v-for="day in days" :key="day" class="day-name" :class="{ today: day === todayName }">
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trend-chart {
  height: 160px;
}

.title {
  font-size: 11px;
  font-weight: 500;
  color: var(--font-color-dark);
}

.middle {
  height: 128px;
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
</style>
