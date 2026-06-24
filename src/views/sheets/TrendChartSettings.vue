<script setup lang="ts">
import { ref } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'

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
      <i class="icon fa-solid fa-gear"></i>
      <div class="about">
        <div class="title">Trend Chart Settings</div>
        <div class="subtitle">Customize your trend chart preferences</div>
      </div>
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
    