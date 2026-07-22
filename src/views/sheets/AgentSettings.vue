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
  name: widget.value?.props?.name || '',
  url: widget.value?.props?.url || '',
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
        <div class="title">Agent Settings</div>
        <div class="subtitle">Customize your agent preferences</div>
      </div>
    </div>
    <div class="field">
      <label>Agent Name</label>
      <input
        type="text"
        v-model="form.name"
        placeholder="Enter agent name"
      />
    </div>
    <div class="field">
      <label>Agent Connection URL</label>
      <input
        type="text"
        v-model="form.url"
        placeholder="API endpoint or CURL command with variables: PROMPT, THREAD_ID"
      />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>
    