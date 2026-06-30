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
  title: widget.value?.props?.title || '',
  name1: widget.value?.props?.name1 || 'A',
  url1: widget.value?.props?.url1 || '',
  name2: widget.value?.props?.name2 || 'B',
  url2: widget.value?.props?.url2 || '',
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
        <div class="title">Ring Chart Settings</div>
        <div class="subtitle">Customize your ring chart preferences</div>
      </div>
    </div>
    <div class="field">
      <label for="stat-name">Title</label>
      <input
        id="stat-name"
        type="text"
        v-model="form.title"
        placeholder="Enter title"
      />
    </div>
    <div class="field">
      <label for="stat-name">Stat #1 name</label>
      <input
        id="stat-name"
        type="text"
        v-model="form.name1"
        placeholder="Enter stat #1 name"
      />
    </div>
    <div class="field">
      <label for="stat-url">Stat #1 API URL</label>
      <input
        id="stat-url"
        type="text"
        v-model="form.url1"
        placeholder="Enter Stat #1 API URL"
      />
    </div>
    <div class="field">
      <label for="stat-name">Stat #2 name</label>
      <input
        id="stat-name"
        type="text"
        v-model="form.name2"
        placeholder="Enter stat #2 name"
      />
    </div>
    <div class="field">
      <label for="stat-url">Stat #2 API URL</label>
      <input
        id="stat-url"
        type="text"
        v-model="form.url2"
        placeholder="Enter Stat #2 API URL"
      />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>
