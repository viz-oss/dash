<script setup lang="ts">
const props = defineProps({
  // Total desktops in the switcher
  total: {
    type: Number,
    required: true,
  },
  // Current desktop index (0-based)
  current: {
    type: Number,
    required: true,
  },
  // Minimal swipe distance (px) to change desktop
  // swipeThreshold: {
  //   type: Number,
  //   default: 20,
  // },
})

const emit = defineEmits(['go-to'])

function onClick(index: number) {
  // Ignore click if it was a swipe (pointerup after swipe)
  // if (swipeMoved) return
  emit('go-to', index)
}
</script>

<template>
  <nav class="card navbar">
    <span v-for="i in total" :key="i" :class="['dot', { fill: i - 1 === current }]" @click.stop="onClick(i - 1)"></span>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 100;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid var(--font-color-light);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  outline: none;
}

.dot.fill {
  background: var(--font-color-light);
}
</style>
