<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import NavBar from '@/components/nav/NavBar.vue'
import type { DesktopLayout } from '@/types/desktop'
import { useEditmodeStore } from '@/stores/editmode'
import { useDesktopStore } from '@/stores/desktopStore'

const props = defineProps<{
  desktops: DesktopLayout[]
}>()

const emit = defineEmits(['change'])
const editmodeStore = useEditmodeStore()
const desktopStore = useDesktopStore()
const current = ref(0)
const pendingProgrammaticIndex = ref<number | null>(null)
const desktopKeys = ref<number[]>([])
let nextDesktopKey = 0

function syncDesktopKeys(length: number) {
  while (desktopKeys.value.length < length) {
    desktopKeys.value.push(nextDesktopKey++)
  }
  if (desktopKeys.value.length > length) {
    desktopKeys.value.splice(length)
  }
}

watch(
  () => props.desktops.length,
  (length) => syncDesktopKeys(length),
  { immediate: true },
)

// --- Navigation ---

function goTo(index: number) {
  const total = props.desktops.length
  const next = Math.max(0, Math.min(total - 1, index))
  if (next === current.value) return
  pendingProgrammaticIndex.value = next
  current.value = next
  scrollTo(next, true)
  emit('change', next)
}

function scrollTo(index: number, smooth = true) {
  const container = document.querySelector('.desktops-container') as HTMLElement | null
  if (!container) return
  const desktop = container.querySelectorAll('.desktop')[index]
  desktop?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'instant',
    block: 'nearest',
    inline: 'start',
  })
}

// --- Change ---

// Switch places with desktop on the left side
function moveLeft() {
  if (current.value > 0) {
    const index = current.value
    desktopStore.moveDesktopLeft(index)

    const keyTemp = desktopKeys.value[index - 1]!
    desktopKeys.value[index - 1] = desktopKeys.value[index]!
    desktopKeys.value[index] = keyTemp

    goTo(current.value - 1)
  }
}

// Switch places with desktop on the right side
function moveRight() {
  if (current.value < props.desktops.length - 1) {
    const index = current.value
    desktopStore.moveDesktopRight(index)

    const keyTemp = desktopKeys.value[index + 1]!
    desktopKeys.value[index + 1] = desktopKeys.value[index]!
    desktopKeys.value[index] = keyTemp

    goTo(current.value + 1)
  }
}

// Add a new desktop with an empty layout
async function addNew() {
  desktopStore.addDesktop([])
  desktopKeys.value.push(nextDesktopKey++)
  await nextTick()
  goTo(props.desktops.length - 1)
}

// Delete the current desktop
function deleteCurrent() {
  if (confirm('Are you sure you want to delete this desktop?')) {
    const deletingIndex = current.value
    desktopKeys.value.splice(deletingIndex, 1)
    desktopStore.removeDesktop(deletingIndex)
    syncDesktopKeys(props.desktops.length)

    if (current.value >= props.desktops.length) {
      current.value = Math.max(0, props.desktops.length - 1)
    }

    goTo(current.value)
  }
}

// --- IntersectionObserver: sync current ---

let observer: IntersectionObserver | null = null

onMounted(() => {
  const container = document.querySelector('.desktops-container') as HTMLElement | null
  if (!container) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (pendingProgrammaticIndex.value !== null && index !== pendingProgrammaticIndex.value) {
            return
          }
          if (!isNaN(index) && index !== current.value) {
            current.value = index
            emit('change', index)
          }
          if (index === pendingProgrammaticIndex.value) {
            pendingProgrammaticIndex.value = null
          }
        }
      })
    },
    { root: container, threshold: 0.6 },
  )

  container.querySelectorAll('.desktop').forEach((el) => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="desktops-container">
    <div
      class="desktop"
      v-for="(desktop, index) in desktops"
      :key="desktopKeys[index]"
      :data-index="index"
    >
      <slot :desktop="desktop" :index="index" />
    </div>
  </div>
  <NavBar
    v-if="desktops.length > 1 || editmodeStore.editmode"
    :total="desktops.length"
    :current="current"
    :swipe-threshold="20"
    @go-to="goTo"
    @move-left="moveLeft"
    @move-right="moveRight"
    @add-next="addNew"
    @delete-current="deleteCurrent"
  />
</template>

<style scoped>
.desktops-container {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

.desktop {
  flex: 0 0 100vw;
  scroll-snap-align: start;
}
</style>
