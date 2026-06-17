<script setup lang="ts">
import { ref } from 'vue'
import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
import WorkspaceIcon from './WorkspaceIcon.vue'
import Icon from '@/components/base/Icon.vue'
import { useEditmodeStore } from '../stores/editmode.ts'

defineProps({
  id: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'fa-regular fa-face-smile',
  },
  title: {
    type: String,
    default: 'Project Name',
  },
  username: {
    type: String,
    default: 'Tester',
  },
  description: {
    type: String,
    default: 'Workspace for testing purposes',
  },
})

const editmodeStore = useEditmodeStore()
const sheet = ref(false)
const emit = defineEmits(['remove'])
</script>

<template>
  <div class="widget-full workspace-nav">
    <div class="workspace-info" @click="sheet = editmodeStore.editmode ? !sheet : false">
      <WorkspaceIcon />
      <div class="text">
        <div class="title">{{ title }}, {{ username }}</div>
        <div class="description">{{ description }}</div>
      </div>
    </div>
    <Icon
      icon="fa-regular fa-pen-to-square"
      class="edit-icon"
      :class="{ 'edit-icon--active': editmodeStore.editmode }"
      @click="editmodeStore.toggle"
    />
  </div>
  <BottomSheet v-model="sheet">
    HEJ
  </BottomSheet>
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

.workspace-info {
  border: 2px solid transparent;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.editmode .workspace-info {
  border: 2px solid var(--edit-color);
}

.text {
  margin: 0 11px;
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
  background-color: var(--edit-color);
  box-shadow: inset 0 1px 3px var(--shadow-color);
}
</style>
