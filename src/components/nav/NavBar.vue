<script setup lang="ts">
import Icon from '@/components/base/Icon.vue'
import { useEditmodeStore } from '@/stores/editmode'

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
  swipeThreshold: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(['go-to', 'move-left', 'move-right', 'add-next', 'delete-current'])
const editmodeStore = useEditmodeStore()

function onClick(index: number) {
  // Ignore click if it was a swipe (pointerup after swipe)
  if (swipeMoved) return
  emit('go-to', index)
}

// --- Pointer swipe ---

let startX = 0
let isDragging = false
let swipeMoved = false

function onPointerDown(e: PointerEvent) {
  startX = e.clientX
  isDragging = true
  swipeMoved = false
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging) return
  const dx = Math.abs(e.clientX - startX)
  if (dx > 6) swipeMoved = true
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging) return
  isDragging = false
  const dx = e.clientX - startX
  if (Math.abs(dx) >= props.swipeThreshold) {
    if (dx < 0) emit('go-to', props.current + 1)
    else emit('go-to', props.current - 1)
  }
}
</script>

<template>
  <div class="nav-wrapper">
    <Icon v-if="editmodeStore.editmode" icon="fa-solid fa-trash" @click="emit('delete-current')" />
    <Icon
      v-if="editmodeStore.editmode"
      icon="fa-solid fa-chevron-left"
      :class="{ disabled: current === 0 }"
      @click="emit('move-left')"
    />
    <nav
      class="card navbar"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <span
        v-for="i in total"
        :key="i"
        :class="['dot', { fill: i - 1 === current }]"
        @click.stop="onClick(i - 1)"
      ></span>
    </nav>
    <Icon
      v-if="editmodeStore.editmode"
      icon="fa-solid fa-chevron-right"
      :class="{ disabled: current === total - 1 }"
      @click="emit('move-right')"
    />
    <Icon v-if="editmodeStore.editmode" icon="fa-solid fa-plus" @click="emit('add-next')" />
  </div>
</template>

<style scoped>
.nav-wrapper {
  position: fixed;
  bottom: 20px;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.navbar {
  width: 55%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 20px;
  background-color: var(--color-dots-bg, rgba(0, 0, 0, 0.06));
  backdrop-filter: blur(20px);
  transition: background-color 0.25s ease;
  touch-action: pan-y;
  cursor: pointer;
  user-select: none;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background-color: var(--color-dot, rgba(120, 120, 120, 0.25));
  cursor: pointer;
  transition:
    width 0.25s ease,
    border-radius 0.25s ease,
    background-color 0.25s ease;
  flex-shrink: 0;
}

.dot.fill {
  width: 20px;
  border-radius: 4px;
  background-color: var(--color-dot, rgba(120, 120, 120, 0.25));
}

.icon {
  cursor: pointer;
}
</style>
