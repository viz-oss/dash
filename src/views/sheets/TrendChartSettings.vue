<script setup lang="ts">
import { ref } from 'vue'
import { useDesktopStore } from '@/stores/desktopStore'

const props = defineProps({
  widgetId: {
    type: String,
    required: true,
  },
})

const desktopStore = useDesktopStore()
const { updateWidget } = desktopStore
const desktopIndex = ref(
  desktopStore.desktops.findIndex((desktop) =>
    desktop.some((item) => item.i === props.widgetId)
  )
)
const widget = ref(
  desktopStore.desktops.flat().find((item) => item.i === props.widgetId)
)

const form = ref({
  title: widget.value?.props?.title || 'Overview',
  url: widget.value?.props?.url || ''
})

const emit = defineEmits(['close'])

function save() {
  updateWidget(desktopIndex.value, props.widgetId, form.value)
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
      <i class="icon fa-solid fa-gear"></i>
      <div class="about">
        <div class="title">Trend Chart Settings</div>
        <div class="subtitle">Customize your trend chart preferences</div>
      </div>
    </div>
    <div class="field">
      <label for="stat-name">Stat Name</label>
      <input
        id="stat-name"
        type="text"
        v-model="form.title"
        placeholder="Enter stat name"
      />
    </div>
    <div class="field">
      <label for="stat-url">API URL</label>
      <input
        id="stat-url"
        type="text"
        v-model="form.url"
        placeholder="Enter API URL"
      />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>
    