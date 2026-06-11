<script setup lang="ts">
import { computed } from 'vue';

defineProps({
    title: {
        type: String,
        default: 'Overview'
    },
})

// type TimeUnit = 'hour' | 'day' | 'week' | 'month' | 'year';
// const selectedTimeUnit = ref<TimeUnit>('day');

// Generate an array of day names
function getDayNames(locale = navigator.language) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(2026, 5, i + 1); // June 1-7, 2026
    const dayName = date.toLocaleDateString(locale, { weekday: 'short' });
    days.push(dayName);
  }
  return days;
}
const days = getDayNames();
const todayName = computed(() => {
  return new Intl.DateTimeFormat(navigator.language, { weekday: 'short' }).format(new Date());
});

</script>

<template>
    <div class="trend-chart">
        <div class="top">
            <div class="title">{{ title }}</div>
        </div>
        <div class="middle">
        </div>
        <div class="bottom">
            <div class="days">
                <div v-for="day in days" :key="day" class="day-name" :class="{ 'today': day === todayName }">{{ day }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.trend-chart {
  width: 100%;
  height: 160px;
  border-radius: 10px;
  margin-top: 16px;
  margin-bottom: 16px;
  background-color: var(--white-color);
  box-shadow: 0 0 4px var(--shadow-color);
}

.title {
  font-size: 11px;
  font-weight: 500;
  color: var(--font-color-dark);
  margin: 16px 13px;
}

.middle {
  height: 50%;
}

.days {
  margin: 10px 13px;
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