<script setup lang="ts">
import IconPicker from '@/components/base/IconPicker.vue'
import { ref } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'

const workspace = useWorkspaceStore()

const form = ref({
  title: workspace.title,
  description: workspace.description,
})

const emit = defineEmits(['close'])

function save() {
  workspace.update(form.value)
  close()
}

function close() {
  emit('close')
}
</script>

<template>
  <div class="sheet-content">
    <div class="sheet-header">
      <i class="icon fa-solid fa-building"></i>
      <div class="about">
        <div class="title">Workspace Settings</div>
        <div class="subtitle">Customize your workspace preferences</div>
      </div>
    </div>
    <div class="field">
      <label for="workspace-name">Workspace Name</label>
      <input
        id="workspace-name"
        type="text"
        v-model="form.title"
        placeholder="Enter workspace name"
      />
    </div>
    <div class="field">
      <label for="workspace-description">Description</label>
      <textarea
        id="workspace-description"
        v-model="form.description"
        placeholder="Enter workspace description"
      ></textarea>
    </div>
    <div class="field">
      <label>Workspace Icon</label>
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
      />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>

<style scoped></style>
