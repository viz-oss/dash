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
      <IconPicker
        :icons="[
          'fa-regular fa-face-smile',
          'fa-solid fa-person',
          'fa-solid fa-briefcase',
          'fa-solid fa-timeline',
          'fa-regular fa-calendar',
          'fa-solid fa-ticket-simple',
          'fa-solid fa-address-card',
          'fa-regular fa-building',
          'fa-solid fa-magnifying-glass',
          'fa-solid fa-tree',
          'fa-solid fa-gem',
          'fa-solid fa-cubes',
          'fa-solid fa-plane',
          'fa-solid fa-rocket',
          'fa-solid fa-ship',
          'fa-solid fa-car',
          'fa-solid fa-bicycle',
          'fa-solid fa-couch',
          'fa-solid fa-dumbbell',
          'fa-solid fa-feather',
          'fa-solid fa-golf-ball-tee',
          'fa-solid fa-headphones',
          'fa-solid fa-heart',
          'fa-solid fa-leaf',
        ]"
      />
    </div>
  </div>
</template>

<style scoped></style>
