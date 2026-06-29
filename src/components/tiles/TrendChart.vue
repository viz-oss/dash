<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditmodeStore } from '@/stores/editmode'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import TrendChartSettings from '@/views/sheets/TrendChartSettings.vue'

defineProps({
  id: {
    type: String,
    required: true,
    default: () => `trend-chart-${Math.random().toString(36).substr(2, 9)}`,
  },
  title: {
    type: String,
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
  <div
    :class="['card', 'full', !thumb && editmodeStore.editmode ? 'editmode' : '', thumb ? 'thumb' : '']"
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
    <VueBottomSheet ref="sheet">
      <TrendChartSettings />
    </VueBottomSheet>
  </div>
</template>

<style scoped>
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

.thumb .middle {
  background-size: 300px !important;
  background-position: center 10% !important;
}

</style>
