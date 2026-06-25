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
        <div class="title">Landscape Settings</div>
        <div class="subtitle">Customize your landscape preferences</div>
      </div>
    </div>
    <div class="field">
      <label for="landscape-name">Select the picture</label>
      <div class="landscape-options">
        <div class="card">
          <img src="/public/_landscape-mountains.png" title="Mountains" />
        </div>
        <div class="card">
          <img src="/public/_landscape-school.png" title="School" />
        </div>
        <div class="card">
          <img src="/public/_landscape-library.png" title="Library" />
        </div>
      </div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>

<style scoped>
.landscape-options {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px 5px;
}

.card {
  width: 33.33%;
  height: 110px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
  cursor: pointer;
}

</style>
    