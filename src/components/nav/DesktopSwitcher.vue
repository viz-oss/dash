<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import NavBar from '@/components/nav/NavBar.vue'
import type { DesktopLayout } from '@/types/desktop'
import { useEditmodeStore } from '@/stores/editmode'

const props = defineProps<{
  desktops: DesktopLayout[]
}>()

const emit = defineEmits(['change'])
const editmodeStore = useEditmodeStore()
const current = ref(0)
const pendingProgrammaticIndex = ref<number | null>(null)
const desktopKeys = new WeakMap<DesktopLayout, number>()
let nextDesktopKey = 0

function getDesktopKey(desktop: DesktopLayout) {
  let key = desktopKeys.get(desktop)
  if (key === undefined) {
    key = nextDesktopKey++
    desktopKeys.set(desktop, key)
  }
  return key
}

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
    const temp = props.desktops[current.value - 1]!
    props.desktops[current.value - 1] = props.desktops[current.value]!
    props.desktops[current.value] = temp
    goTo(current.value - 1)
  }
}

// Switch places with desktop on the right side
function moveRight() {
  if (current.value < props.desktops.length - 1) {
    const temp = props.desktops[current.value + 1]!
    props.desktops[current.value + 1] = props.desktops[current.value]!
    props.desktops[current.value] = temp
    goTo(current.value + 1)
  }
}

// Add a new desktop with an empty layout
async function addNew() {
  props.desktops.push([])
  await nextTick()
  goTo(props.desktops.length - 1)
}

// Delete the current desktop
function deleteCurrent() {
  if (confirm('Are you sure you want to delete this desktop?')) {
    props.desktops.splice(current.value, 1)
    if (current.value >= props.desktops.length) {
      current.value = props.desktops.length - 1
      goTo(current.value)
    }
    if (props.desktops.length === 0) {
      props.desktops.push([])
      current.value = 0
      goTo(current.value)
    }
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
      :key="getDesktopKey(desktop)"
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
