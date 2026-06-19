<script setup lang="ts">
import { ref } from 'vue'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import WorkspaceIcon from '@/components/WorkspaceIcon.vue'
import Icon from '@/components/base/Icon.vue'
import { useEditmodeStore } from '@/stores/editmode.ts'
import WorkspaceInfoSheet from '@/views/sheets/WorkspaceInfoSheet.vue'
import { useWorkspaceStore } from '@/stores/workspace'

defineProps({
  id: {
    type: String,
    required: true,
  },
})

const editmodeStore = useEditmodeStore()
const emit = defineEmits(['remove'])
const workspace = useWorkspaceStore()
const sheet = ref<{ open: () => void; close: () => void } | null>(null)
</script>

<template>
  <div class="widget-full workspace-nav">
    <div class="workspace-info" @click="editmodeStore.editmode ? sheet?.open() : sheet?.close()">
      <WorkspaceIcon :icon="workspace.icon" />
      <div class="text">
        <div class="title">{{ workspace.title }}</div>
        <div class="description">{{ workspace.description }}</div>
      </div>
    </div>
    <Icon
      icon="fa-regular fa-pen-to-square"
      class="edit-icon"
      :class="{ 'edit-icon--active': editmodeStore.editmode }"
      @click="editmodeStore.toggle"
    />
  </div>
  <VueBottomSheet ref="sheet">
    <WorkspaceInfoSheet @close="sheet?.close()" />
  </VueBottomSheet>
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
