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
  max: widget.value?.props?.max || '',
  name1: widget.value?.props?.name1 || 'A',
  value1: widget.value?.props?.value1 || '',
  name2: widget.value?.props?.name2 || 'B',
  value2: widget.value?.props?.value2 || '',
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
        <div class="title">Ring Chart Settings</div>
        <div class="subtitle">Customize your ring chart preferences</div>
      </div>
    </div>
    <div class="field">
      <label>Title</label>
      <input
        type="text"
        v-model="form.title"
        placeholder="Enter title"
      />
    </div>
    <div class="field">
      <label>Stat Max</label>
      <input
        type="text"
        v-model="form.max"
        placeholder="Enter stat max"
      />
    </div>
    <div class="field">
      <label>Stat #1 Name</label>
      <input
        type="text"
        v-model="form.name1"
        placeholder="Enter stat #1 name"
      />
    </div>
    <div class="field">
      <label>Stat #1 Value</label>
      <input
        type="text"
        v-model="form.value1"
        placeholder="Enter Stat #1 Value"
      />
    </div>
    <div class="field">
      <label>Stat #2 Name</label>
      <input
        type="text"
        v-model="form.name2"
        placeholder="Enter stat #2 name"
      />
    </div>
    <div class="field">
      <label>Stat #2 Value</label>
      <input
        type="text"
        v-model="form.value2"
        placeholder="Enter Stat #2 Value"
      />
    </div>
    <hr>
    <div class="field">
      <label>API URL</label>
      <input type="text" v-model="form.url" placeholder="API endpoint or CURL command" />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>
