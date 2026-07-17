<script setup lang="ts">
import { ref } from 'vue'
import { useDesktopStore } from '@/stores/desktopStore'
import IconPicker from '@/components/base/IconPicker.vue'

const props = defineProps({
  widgetId: {
    type: String,
    required: true,
  },
})

const desktopStore = useDesktopStore()
const { updateWidget } = desktopStore
const desktopIndex = ref(
  desktopStore.desktops.findIndex((desktop) => desktop.some((item) => item.i === props.widgetId)),
)
const widget = ref(desktopStore.desktops.flat().find((item) => item.i === props.widgetId))

const form = ref({
  icon: widget.value?.props?.icon || 'fas fa-users',
  title: widget.value?.props?.title || '',
  value: widget.value?.props?.value || '',
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
        <div class="title">Stat Card Settings</div>
        <div class="subtitle">Customize your stat card preferences</div>
      </div>
    </div>
    <div class="field">
      <label>Stat Icon</label>
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
          'fa-regular fa-money-bill-1',
          'fa-solid fa-circle-check',
          'fa-solid fa-circle-xmark',
          'fa-solid fa-crown',
          'fa-solid fa-flag-checkered',
          'fa-solid fa-medal',
          'fa-solid fa-trophy',
          'fa-solid fa-bullhorn',
          'fa-solid fa-bell',
          'fa-solid fa-triangle-exclamation',
        ]"
        v-model="form.icon"
      />
    </div>
    <div class="field">
      <label for="stat-name">Stat Name</label>
      <input id="stat-name" type="text" v-model="form.title" placeholder="Enter stat name" />
    </div>
    <div class="field">
      <label for="stat-value">Stat Value</label>
      <input
        id="stat-value"
        type="text"
        v-model="form.value"
        placeholder="Enter result path (e.g. $data.count)"
      />
    </div>
    <hr>
    <div class="field">
      <label for="stat-url">API URL</label>
      <input id="stat-url" type="text" v-model="form.url" placeholder="API endpoint or CURL command" />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>
