<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  theme: widget.value?.props?.theme || 'mountains',
})

let sheetCards = ref<HTMLElement | null>(null)
const emit = defineEmits(['close'])
let selected: string | null = null

onMounted(() => {
  const slots = sheetCards.value?.querySelectorAll('.card') || []
  slots.forEach((slot) => {
    ;(slot as HTMLElement).addEventListener('click', () => {
      slots.forEach((s) => s.classList.remove('selected'))
      ;(slot as HTMLElement).classList.add('selected')
      selected = (slot as HTMLElement).dataset.theme || null
    })
  })
})

function save() {
  if (selected) form.value.theme = selected
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
        <div class="title">Landscape Settings</div>
        <div class="subtitle">Customize your landscape preferences</div>
      </div>
    </div>
    <div class="field">
      <label for="landscape-name">Select the picture</label>
      <div class="landscape-options" ref="sheetCards">
        <div class="card" :class="{ selected: form.theme === 'library' }" data-theme="library">
          <img src="/public/_landscape-library.png" title="Library" />
        </div>
        <div class="card" :class="{ selected: form.theme === 'townsquare' }" data-theme="townsquare">
          <img src="/public/_landscape-townsquare.png" title="Town Square" />
        </div>
        <div class="card" :class="{ selected: form.theme === 'school' }" data-theme="school">
          <img src="/public/_landscape-school.png" title="School" />
        </div>
        <div class="card" :class="{ selected: form.theme === 'mountains' }" data-theme="mountains">
          <img src="/public/_landscape-mountains.png" title="Mountains" />
        </div>
        <div class="card" :class="{ selected: form.theme === 'ocean' }" data-theme="ocean">
          <img src="/public/_landscape-ocean.png" title="Ocean" />
        </div>
        <div class="card" :class="{ selected: form.theme === 'countryside' }" data-theme="countryside">
          <img src="/public/_landscape-countryside.png" title="Countryside" />
        </div>
      </div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>

<style scoped>
.landscape-options {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px 5px;
}

.card {
  width: calc(33.33% - 4px);
  height: 110px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: 2px solid transparent;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
  cursor: pointer;
}

.card.selected {
  border: 2px solid var(--key-color-dark);
}

</style>
