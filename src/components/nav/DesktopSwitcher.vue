<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NavBar from '@/components/nav/NavBar.vue'
import type { DesktopLayout } from '@/types/desktop'

const props = defineProps<{
  desktops: DesktopLayout[]
}>()

const emit = defineEmits(['change'])
const current = ref(0)

// --- Navigation ---

function goTo(index: number) {
  const total = props.desktops.length
  const next = Math.max(0, Math.min(total - 1, index))
  if (next === current.value) return
  current.value = next
  scrollToDesktop(next, true)
  emit('change', next)
}

function scrollToDesktop(index: number, smooth = true) {
  const container = document.querySelector('.desktops-container') as HTMLElement | null
  if (!container) return
  const desktop = container.querySelectorAll('.desktop')[index]
  desktop?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'instant',
    block: 'nearest',
    inline: 'start',
  })
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
          if (!isNaN(index) && index !== current.value) {
            current.value = index
            emit('change', index)
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
    <div class="desktop" v-for="(desktop, index) in desktops" :key="index" :data-index="index">
      <slot :desktop="desktop" :index="index" />
    </div>
  </div>
  <NavBar :total="desktops.length" :current="current" :swipe-threshold="20" @go-to="goTo" />
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
