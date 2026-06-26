<script setup lang="ts">
import type { Layout } from 'grid-layout-plus'

const props = defineProps<{
  desktops: Layout[]
}>()
</script>

<template>
  <div class="desktops-container">
    <div class="desktop" v-for="(desktop, index) in desktops" :key="index" :data-index="index">
      <slot :desktop="desktop" :index="index" />
    </div>
  </div>
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
