<script setup lang="ts">
import { ref } from 'vue'
import StatCard from '@/components/tiles/StatCard.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const workspace = useWorkspaceStore()

const form = ref({
  icon: workspace.icon,
  title: workspace.title,
  description: workspace.description,
})

const emit = defineEmits(['close'])

function save() {
  workspace.update(form.value)
  close()
}

function close() {
  // Remove focus to prevent aria-hidden warning when sheet closes
  ;(document.activeElement as HTMLElement)?.blur()
  emit('close')
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
    <div class="sheet-body">
      <div class="slot">
        <StatCard
          :fake="true"
          id="example-stat-card"
          title="Example"
          icon="fa-solid fa-chart-bar"
          value="Stat Card"
          change-value="5%"
          :is-up="true"
          tone="x1"
        />
      </div>
      <div class="slot">
        <StatCard
          :fake="true"
          id="example-stat-card"
          title="Example"
          icon="fa-solid fa-chart-bar"
          value="Stat Card"
          change-value="5%"
          :is-up="true"
          tone="x1"
        />
      </div>
      <div class="slot">
        <StatCard
          :fake="true"
          id="example-stat-card"
          title="Example"
          icon="fa-solid fa-chart-bar"
          value="Stat Card"
          change-value="5%"
          :is-up="true"
          tone="x1"
        />
      </div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>

<style scoped>
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

.slot .card.selected:after {
}
</style>
