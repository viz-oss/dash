<script setup lang="ts">
import { computed, ref } from 'vue'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import Icon from '@/components/base/Icon.vue'
import { useEditmodeStore } from '@/stores/editmode.ts'
import { useDesktopStore } from '@/stores/desktopStore'
import { defaultDesktopInfo } from '@/types/desktop'
import AddNewTileSheet from '@/views/sheets/AddNewTileSheet.vue'
import WorkspaceInfoSheet from '@/views/sheets/WorkspaceInfoSheet.vue'

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: () => `topnav-${crypto.randomUUID()}`,
  },
  desktopIndex: {
    type: Number,
    required: true,
  },
})

const editmodeStore = useEditmodeStore()
const desktopStore = useDesktopStore()
const emit = defineEmits(['remove', 'add'])
const sheetAddNewTile = ref<{ open: () => void; close: () => void } | null>(null)
const sheetWorkspaceInfo = ref<{ open: () => void; close: () => void } | null>(null)
const addNewTileSheet = ref<{ onOpened: () => void } | null>(null)
const desktopInfo = computed(() => desktopStore.info[props.desktopIndex] ?? defaultDesktopInfo)

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
      class="desktop-info"
      @click="editmodeStore.editmode ? sheetWorkspaceInfo?.open() : sheetWorkspaceInfo?.close()"
    >
      <Icon :icon="desktopInfo.icon" />
      <div class="text">
        <div class="title">{{ desktopInfo.title }}</div>
        <div class="description">{{ desktopInfo.description }}</div>
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
    <VueBottomSheet ref="sheetAddNewTile" @opened="handleAddNewTileOpened">
      <AddNewTileSheet ref="addNewTileSheet" @ok="handleOK" @cancel="handleCancel" />
    </VueBottomSheet>
    <VueBottomSheet ref="sheetWorkspaceInfo">
      <WorkspaceInfoSheet
        :desktop-index="props.desktopIndex"
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

.desktop-info {
  border: 2px solid transparent;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.editmode .desktop-info {
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

.editmode .desktop-info,
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
