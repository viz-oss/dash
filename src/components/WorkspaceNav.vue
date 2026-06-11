<script setup lang="ts">
import Icon from './Icon.vue';
import Dropdown from './Dropdown.vue';

defineProps({
  icon: {
    type: String,
    default: 'fa-regular fa-face-smile'
  },
})
</script>

<template>
  <div class="widget-full workspace-nav">
    <Icon :icon="icon" />
    <div class="text">
        <div class="title">Project ABC, Tester</div>
        <div class="description">Workspace for testing purposes</div>
    </div>
    <Dropdown style="margin-left: auto;" />
  </div>
</template>

<style scoped>
.workspace-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  width: 100%;
  height: 35px;
}

.text {
  margin-left: 11px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: var(--font-color-dark);
  margin-top: 1px;
}

.description {
  font-size: 9px;
  font-weight: 500;
  color: var(--font-color-light);
  margin-bottom: 2px;
}
</style>