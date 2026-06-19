<script setup lang="ts">
import IconPicker from '@/components/base/IconPicker.vue'
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
        <input id="workspace-name" type="text" placeholder="Enter workspace name" />
    </div>
    <div class="field">
        <label for="workspace-description">Description</label>
        <textarea id="workspace-description" placeholder="Enter workspace description"></textarea>
    </div>
    <div class="field">
        <label>Workspace Icon</label>
        <IconPicker :icons="['fa-regular fa-face-smile', 'fa-solid fa-briefcase', 'fa-solid fa-cubes']" />
    </div>
  </div>
</template>

<style scoped>
</style>