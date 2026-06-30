<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatCard from '@/components/tiles/StatCard.vue'
import RingChart from '@/components/tiles/RingChart.vue'
import TrendChart from '@/components/tiles/TrendChart.vue'
import AgentAvatar from '@/components/tiles/AgentAvatar.vue'
import Landscape from '@/components/tiles/Landscape.vue'
// import { useWorkspaceStore } from '@/stores/workspace'

// const workspace = useWorkspaceStore()

// const form = ref({
//   icon: workspace.icon,
//   title: workspace.title,
//   description: workspace.description,
// })

let sheetBody = ref<HTMLElement | null>(null)
const emit = defineEmits(['ok', 'cancel'])
let selected: string | null = null

function onOpened() {
  selected = null
  const slots = sheetBody.value?.querySelectorAll('.slot') || []
  slots.forEach((slot) => slot.classList.remove('selected'))
}

defineExpose({
  onOpened,
})

onMounted(() => {
  const slots = sheetBody.value?.querySelectorAll('.slot') || []
  slots.forEach((slot) => {
    ;(slot as HTMLElement).addEventListener('click', () => {
      slots.forEach((s) => s.classList.remove('selected'))
      ;(slot as HTMLElement).classList.add('selected')
      selected = (slot as HTMLElement).dataset.tile || null
    })
  })
})

function ok() {
  // workspace.update(form.value)
  // Remove focus to prevent aria-hidden warning when sheet closes
  ;(document.activeElement as HTMLElement)?.blur()
  emit('ok', selected)
}

function cancel() {
  // Remove focus to prevent aria-hidden warning when sheet closes
  ;(document.activeElement as HTMLElement)?.blur()
  emit('cancel')
}

</script>

<template>
  <div class="sheet-content">
    <div class="sheet-header">
      <i class="icon fa-solid fa-building"></i>
      <div class="about">
        <div class="title">Add new tile</div>
        <div class="subtitle">Select the new tile you want to add to your dashboard</div>
      </div>
    </div>
    <div class="sheet-body" ref="sheetBody">
      <div class="slot" data-tile="stat">
        <StatCard
          :thumb="true"
          id="example-stat-card"
          title="Stat Card"
          icon="fa-solid fa-chart-bar"
          value="1.23"
          change-value="4%"
          :is-up="true"
          tone="x1"
        />
      </div>
      <div class="slot" data-tile="ring">
        <RingChart
          :thumb="true"
          id="example-ring-chart"
          title="Ring Chart"
          :series="{ 'Example 1': 70, 'Example 2': 30 }"
        />
      </div>
      <div class="slot" data-tile="trend">
        <TrendChart :thumb="true" id="example-trend-chart" title="Trend Chart" />
      </div>
      <div class="slot" data-tile="agent">
        <AgentAvatar :thumb="true" id="example-agent-avatar" hint="Agent" />
      </div>
      <div class="slot" data-tile="landscape">
        <Landscape :thumb="true" id="example-landscape" theme="mountains" />
      </div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="cancel">Cancel</button>
      <button class="btn btn-primary" @click="ok">Save Changes</button>
    </div>
  </div>
</template>

<style scoped>
.slot {
  width: calc(33.33% - 10px);
  aspect-ratio: 1 / 1;
}

.slot .card {
  border: 2px solid transparent;
}

.slot.selected .card {
  border: 2px solid var(--key-color-dark);
}

.slot .card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.slot .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
  cursor: pointer;
}

.slot .card .metric-value {
  font-size: 17px;
  font-weight: 600;
}
</style>
