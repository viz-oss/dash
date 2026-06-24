<script setup lang="ts">
import { ref } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import IconPicker from '@/components/base/IconPicker.vue'

const workspace = useWorkspaceStore()

const form = ref({
  icon: workspace.icon,
  title: workspace.title,
  description: workspace.description,
})

const emit = defineEmits(['close'])

function save() {
//  workspace.update(form.value)
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
      <i class="icon fa-solid fa-chart-pie"></i>
      <div class="about">
        <div class="title">Stat Card Settings</div>
        <div class="subtitle">Customize your stat card preferences</div>
      </div>
    </div>
    <div class="field">
      <label>Stat Card Icon</label>
      <IconPicker
        :icons="[
          'fa-regular fa-face-smile',
          'fa-solid fa-person',
          'fa-solid fa-briefcase',
          'fa-solid fa-timeline',
          'fa-regular fa-calendar',
          'fa-solid fa-ticket-simple',
          'fa-solid fa-chart-line',
          'fa-solid fa-chart-pie',
          'fa-regular fa-building',
          'fa-solid fa-building-columns',
          'fa-solid fa-tree',
          'fa-solid fa-leaf',
          'fa-solid fa-feather',
          'fa-solid fa-cubes',
          'fa-solid fa-bitcoin-sign',
          'fa-solid fa-gem',
          'fa-solid fa-plane',
          'fa-solid fa-rocket',
          'fa-solid fa-ship',
          'fa-solid fa-car',
          'fa-solid fa-bicycle',
          'fa-solid fa-dumbbell',
          'fa-solid fa-golf-ball-tee',
          'fa-solid fa-heart',
        ]"
        v-model="form.icon"
      />
    </div>
    <div class="field">
      <label for="stat-name">Stat Name</label>
      <input
        id="stat-name"
        type="text"
        v-model="form.title"
        placeholder="Enter stat name"
      />
    </div>
    <div class="field">
      <label for="stat-url">API URL</label>
      <input
        id="stat-url"
        type="text"
        placeholder="Enter API URL"
      />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>
