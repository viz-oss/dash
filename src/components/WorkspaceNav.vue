<script setup lang="ts">
import Icon from './Icon.vue';
import { useEditmodeStore } from '../stores/editmode';

const editmodeStore = useEditmodeStore();

defineProps({
  icon: {
    type: String,
    default: 'fa-regular fa-face-smile'
  },
  title: {
    type: String,
    default: 'Project Name'
  },
  username: {
    type: String,
    default: 'Tester'
  },
  description: {
    type: String,
    default: 'Workspace for testing purposes'
  }
})
</script>

<template>
  <div class="widget-full workspace-nav">
    <Icon :icon="icon" />
    <div class="text">
        <div class="title">{{ title }}, {{ username }}</div>
        <div class="description">{{ description }}</div>
    </div>
    <Icon :icon="'fa-regular fa-pen-to-square'" class="edit-icon" :class="{ 'edit-icon--active': editmodeStore.editmode }" @click="editmodeStore.toggle" />
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

.edit-icon {
  margin-left: auto;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  color: var(--font-color-dark);
  background-color: var(--white-color);
  box-shadow: 0 0 4px var(--shadow-color);
  transition: all 0.15s ease;
  cursor: pointer;
}

.edit-icon--active {
  color: var(--white-color);
  background-color: var(--key-color-dark);
  box-shadow: inset 0 1px 3px var(--shadow-color);
}
</style>