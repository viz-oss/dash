<script setup lang="ts">
import { ref } from 'vue'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import WorkspaceIcon from '@/components/WorkspaceIcon.vue'
import Icon from '@/components/base/Icon.vue'
import { useEditmodeStore } from '@/stores/editmode.ts'
import AddNewTileSheet from '@/views/sheets/AddNewTileSheet.vue'
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
const sheetAddNewTile = ref<{ open: () => void; close: () => void } | null>(null)
const sheetWorkspaceInfo = ref<{ open: () => void; close: () => void } | null>(null)
</script>

<template>
  <div class="widget-full workspace-nav">
    <div
      class="workspace-info"
      @click="editmodeStore.editmode ? sheetWorkspaceInfo?.open() : sheetWorkspaceInfo?.close()"
    >
      <WorkspaceIcon :icon="workspace.icon" />
      <div class="text">
        <div class="title">{{ workspace.title }}</div>
        <div class="description">{{ workspace.description }}</div>
      </div>
    </div>
    <div class="right-icons">
      <Icon
        v-if="editmodeStore.editmode"
        icon="fa-solid fa-plus"
        text="Add"
        class="add-icon"
        @click="sheetAddNewTile?.open()"
      />
      <Icon
        icon="fa-regular fa-pen-to-square"
        class="edit-icon"
        :class="{ 'edit-icon--active': editmodeStore.editmode }"
        @click="editmodeStore.toggle"
      />
    </div>
    <VueBottomSheet ref="sheetAddNewTile">
      <AddNewTileSheet @close="sheetAddNewTile?.close()" />
    </VueBottomSheet>
    <VueBottomSheet ref="sheetWorkspaceInfo">
      <WorkspaceInfoSheet @close="sheetWorkspaceInfo?.close()" />
    </VueBottomSheet>
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
  cursor: default;
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

.right-icons {
  margin-left: auto;
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.editmode .workspace-info,
.editmode .add-icon,
.edit-icon {
  cursor: pointer;
}

.edit-icon--active {
  color: var(--white-color);
  background-color: var(--edit-color);
  box-shadow: inset 0 1px 3px var(--shadow-color);
}
</style>
