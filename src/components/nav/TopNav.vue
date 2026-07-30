<script setup lang="ts">
import { computed, ref } from 'vue'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import Icon from '@/components/base/Icon.vue'
import { useEditmodeStore } from '@/stores/editmode.ts'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { defaultWorkspaceInfo } from '@/types/workspace'
import AddNewTileSheet from '@/components/sheets/AddNewTileSheet.vue'
import WorkspaceInfoSheet from '@/components/sheets/WorkspaceInfoSheet.vue'

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: () => `topnav-${crypto.randomUUID()}`,
  },
  workspaceIndex: {
    type: Number,
    required: true,
  },
})

const editmodeStore = useEditmodeStore()
const workspaceStore = useWorkspaceStore()
const emit = defineEmits(['remove', 'add'])
const sheetAddNewTile = ref<{ open: () => void; close: () => void } | null>(null)
const sheetWorkspaceInfo = ref<{ open: () => void; close: () => void } | null>(null)
const addNewTileSheet = ref<{ onOpened: () => void } | null>(null)
const workspaceInfo = computed(() => workspaceStore.info[props.workspaceIndex] ?? defaultWorkspaceInfo)

const handleAddNewTileOpened = () => {
  addNewTileSheet.value?.onOpened()
}

const handleOK = (tile: string | null) => {
  emit('add', tile)
  sheetAddNewTile?.value?.close()
}

const handleCancel = () => {
  sheetAddNewTile?.value?.close()
}
</script>

<template>
  <div class="widget-full top-nav">
    <div
      class="workspace-info"
      @click="editmodeStore.editmode ? sheetWorkspaceInfo?.open() : sheetWorkspaceInfo?.close()"
    >
      <Icon :icon="workspaceInfo.icon" />
      <div class="text">
        <div class="title">{{ workspaceInfo.title }}</div>
        <div class="description">{{ workspaceInfo.description }}</div>
      </div>
    </div>
    <div class="right-icons">
      <Icon
        v-if="editmodeStore.editmode"
        icon="fa-solid fa-plus"
        text="Add"
        class="add-icon icon-button"
        @click="sheetAddNewTile?.open()"
      />
      <Icon
        icon="fa-regular fa-pen-to-square"
        class="edit-icon"
        :class="{ 'edit-icon--active': editmodeStore.editmode }"
        @click="editmodeStore.toggle"
      />
    </div>
    <VueBottomSheet ref="sheetAddNewTile" @opened="handleAddNewTileOpened">
      <AddNewTileSheet ref="addNewTileSheet" @ok="handleOK" @cancel="handleCancel" />
    </VueBottomSheet>
    <VueBottomSheet ref="sheetWorkspaceInfo">
      <WorkspaceInfoSheet
        :workspace-index="props.workspaceIndex"
        @close="sheetWorkspaceInfo?.close()"
      />
    </VueBottomSheet>
  </div>
</template>

<style scoped>
.top-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  width: calc(100% - 30px);
  height: 35px;
  cursor: default;
  padding: 15px 15px 5px 15px;
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
  font-size: 10px;
  font-weight: 500;
  color: var(--font-color-light);
  margin: 2px 0 4px 0;
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

.edit-icon {
  color: var(--font-color-dark);
  background-color: var(--white-color);
  box-shadow: 0 0 4px var(--shadow-color);
  transition: all 0.15s ease;
}

.edit-icon--active {
  color: var(--white-color);
  background-color: var(--edit-color);
  box-shadow: inset 0 1px 3px var(--shadow-color);
}
</style>
