<script setup lang="ts">
import { ref } from 'vue'
import type { Layout } from 'grid-layout-plus'
import NavBar from '@/components/base/NavBar.vue'

const props = defineProps<{
  desktops: Layout[]
}>()

const emit = defineEmits(['change'])
const current = ref(0)

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

</script>

<template>
  <div class="desktops-container">
    <div class="desktop" v-for="(desktop, index) in desktops" :key="index" :data-index="index">
      <slot :desktop="desktop" :index="index" />
    </div>
  </div>
  <NavBar :total="desktops.length" :current="current" @go-to="goTo" />
</template>

<style scoped>
.desktops-container {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}

.desktop {
  flex: 0 0 100vw;
  scroll-snap-align: start;
}
</style>
