<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDesktopStore } from '@/stores/desktopStore'
import { defaultDesktopInfo } from '@/types/desktop'
import IconPicker from '@/components/base/IconPicker.vue'

const props = defineProps<{
  desktopIndex: number
}>()

const desktopStore = useDesktopStore()

const form = ref({
  ...defaultDesktopInfo,
})

watch(
  () => props.desktopIndex,
  (index) => {
    const desktopInfo = desktopStore.info[index] ?? defaultDesktopInfo
    form.value = {
      icon: desktopInfo.icon,
      title: desktopInfo.title,
      description: desktopInfo.description,
    }
  },
  { immediate: true },
)

const emit = defineEmits(['close'])

function save() {
  desktopStore.updateDesktopInfo(props.desktopIndex, form.value)
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
      <i class="icon fa-solid fa-building"></i>
      <div class="about">
        <div class="title">Workspace Settings</div>
        <div class="subtitle">Customize your workspace preferences</div>
      </div>
    </div>
    <div class="field">
      <label>Workspace Name</label>
      <input
        type="text"
        v-model="form.title"
        placeholder="Enter workspace name"
      />
    </div>
    <div class="field">
      <label>Description</label>
      <input
        type="text"
        v-model="form.description"
        placeholder="Enter workspace description"
      />
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
          'fa-solid fa-chart-line',
          'fa-solid fa-chart-pie',
          'fa-regular fa-building',
          'fa-solid fa-building-columns',
          'fa-solid fa-tree',
          'fa-solid fa-leaf',
          'fa-solid fa-feather',
          'fa-solid fa-cubes',
          'fa-solid fa-bitcoin-sign',
          'fa-solid fa-gem',
          'fa-solid fa-plane',
          'fa-solid fa-rocket',
          'fa-solid fa-ship',
          'fa-solid fa-car',
          'fa-solid fa-bicycle',
          'fa-solid fa-dumbbell',
          'fa-solid fa-golf-ball-tee',
          'fa-solid fa-heart',
          'fa-solid fa-cat',
        ]"
        v-model="form.icon"
      />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>
