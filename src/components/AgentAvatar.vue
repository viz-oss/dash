<script setup lang="ts">
import { useOS } from '@/composables/useOS'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
import '@douxcode/vue-spring-bottom-sheet/dist/style.css'
import Chat from './Chat.vue'

defineProps({
  hint: {
    type: String,
    default: 'Agent session',
  },
})

const { osName } = useOS()
const sheet = ref(false)

// Cactus eye positioning
const cactus = ref<HTMLElement | null>(null)
const eyeLeft = ref<HTMLElement | null>(null)
const eyeRight = ref<HTMLElement | null>(null)

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  startAnimationLoop()
  randomizeBlinkTiming(true)

  if (eyeLeft.value) {
    eyeLeft.value.addEventListener('animationiteration', onBlinkIteration)
  }

  if (osName.value === 'Windows') {
    if (eyeLeft.value) eyeLeft.value.style.left = '27px'
    if (eyeRight.value) eyeRight.value.style.right = '0px'
  } else if (osName.value === 'macOS') {
    if (eyeLeft.value) eyeLeft.value.style.left = '16px'
    if (eyeRight.value) eyeRight.value.style.right = '12px'
  } else if (osName.value === 'iOS') {
    if (eyeLeft.value) eyeLeft.value.style.left = '27px'
    if (eyeRight.value) eyeRight.value.style.right = '0px'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)

  if (eyeLeft.value) {
    eyeLeft.value.removeEventListener('animationiteration', onBlinkIteration)
  }

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (returnToCenterTimer !== null) {
    clearTimeout(returnToCenterTimer)
    returnToCenterTimer = null
  }
})

/**
 * Move both pupils toward the cursor.
 */

function lookAt(cursorX: number, cursorY: number): void {
  updatePupil(eyeLeft.value, cursorX, cursorY)
  updatePupil(eyeRight.value, cursorX, cursorY)
}

/**
 * Update one pupil offset and clamp it to a small radius.
 */

function updatePupil(
  eye: HTMLElement | null,
  cursorX: number | null,
  cursorY: number | null,
): void {
  if (!eye) {
    return
  }

  const state = pupilState.get(eye) ?? { x: 0, y: 0 }
  let targetX = 0
  let targetY = 0

  if (cursorX !== null && cursorY !== null) {
    const rect = eye.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = cursorX - centerX
    const deltaY = cursorY - centerY
    const distance = Math.hypot(deltaX, deltaY)

    if (distance > 0) {
      const ratio = Math.min(maxPupilOffset / distance, 1)
      targetX = deltaX * ratio
      targetY = deltaY * ratio
    }
  }

  const easing = pointerActive ? followEasing : returnEasing
  state.x += (targetX - state.x) * easing
  state.y += (targetY - state.y) * easing
  pupilState.set(eye, state)

  eye.style.setProperty('--pupil-x', `${state.x.toFixed(2)}px`)
  eye.style.setProperty('--pupil-y', `${state.y.toFixed(2)}px`)
}

/**
 * Return pupils to center after brief mouse inactivity.
 */

function scheduleReturnToCenter(): void {
  if (returnToCenterTimer) {
    clearTimeout(returnToCenterTimer)
  }

  returnToCenterTimer = setTimeout(() => {
    pointerActive = false
    targetCursorX = null
    targetCursorY = null
    returnToCenterTimer = null
  }, returnToCenterDelay)
}

/**
 * Reset one pupil offset to center.
 */

function centerPupil(eye: HTMLElement | null): void {
  if (!eye) {
    return
  }

  pupilState.set(eye, { x: 0, y: 0 })
  eye.style.setProperty('--pupil-x', '0px')
  eye.style.setProperty('--pupil-y', '0px')
}

function animatePupils(): void {
  if (targetCursorX !== null && targetCursorY !== null) {
    lookAt(targetCursorX, targetCursorY)
  } else {
    updatePupil(eyeLeft.value, null, null)
    updatePupil(eyeRight.value, null, null)
  }

  animationFrameId = requestAnimationFrame(animatePupils)
}

function startAnimationLoop(): void {
  if (animationFrameId !== null) {
    return
  }

  animationFrameId = requestAnimationFrame(animatePupils)
}

function randomizeBlinkTiming(setDelay = false): void {
  if (!cactus.value) {
    return
  }

  // Keep blinks fairly sparse and natural.
  const interval = 12 + Math.random() * 12
  cactus.value.style.setProperty('--agent-blink-interval', `${interval.toFixed(2)}s`)

  if (setDelay) {
    const delay = -Math.random() * interval
    cactus.value.style.setProperty('--agent-blink-delay', `${delay.toFixed(2)}s`)
  }
}

function onBlinkIteration(): void {
  randomizeBlinkTiming(false)
}

// Pupils follow the cursor with a small bounded offset.
const maxPupilOffset = 2.8
const returnToCenterDelay = 800
const followEasing = 0.24
const returnEasing = 0.1
let returnToCenterTimer: ReturnType<typeof setTimeout> | null = null
let animationFrameId: number | null = null
let targetCursorX: number | null = null
let targetCursorY: number | null = null
let pointerActive = false
const pupilState = new WeakMap<HTMLElement, { x: number; y: number }>()

const onMouseMove = (event: MouseEvent) => {
  pointerActive = true
  targetCursorX = event.clientX
  targetCursorY = event.clientY
  scheduleReturnToCenter()
}
</script>

<template>
  <div class="card" @click="sheet = true">
    <div ref="cactus" class="cactus">
      🌵
      <div ref="eyeLeft" class="eye left"></div>
      <div ref="eyeRight" class="eye right"></div>
      <div class="cloud">{{ hint }}</div>
    </div>
  </div>
  <BottomSheet v-model="sheet">
    <Chat url="https://ai.grindwallet.com/ask?q=%message%&ssid=%ssid%}" />
  </BottomSheet>
</template>

<style scoped>
.card {
  position: relative;
  background: transparent;
  box-shadow: none;
}

.cactus {
  width: 60px;
  height: 80px;
  font-size: 64px;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
}

.cactus .eye {
  position: absolute;
  top: 12px;
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  transform-origin: center 55%;
  transform: scaleY(1);
  animation-name: agent-eye-blink;
  animation-duration: var(--agent-blink-interval, 17.5s);
  animation-delay: var(--agent-blink-delay, -3.4s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
}

.cactus .eye.left {
  left: 18px;
}

.cactus .eye.right {
  right: 18px;
}

.cactus .eye::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 4px;
  height: 4px;
  background-color: black;
  border-radius: 50%;
  transform: translate(var(--pupil-x, 0px), var(--pupil-y, 0px));
  transition: none;
}

.cloud {
  position: absolute;
  left: -30px;
  top: -37px;
  width: 100px;
  font-size: 12px;
  color: var(--font-color-light);
  background: var(--white-color);
  box-shadow: 0 0 4px var(--shadow-color);
  border-radius: 16px;
  padding: 8px 10px;
  text-align: center;
}

.cloud::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 52px;
  width: 12px;
  height: 12px;
  background: var(--white-color);
  box-shadow: 2px 2px 4px var(--shadow-color);
  transform: rotate(45deg);
}

@keyframes agent-eye-blink {
  0%,
  24.8%,
  26.0%,
  73.9%,
  75.1%,
  100% {
    transform: scaleY(1);
  }

  25.05%,
  74.15% {
    transform: scaleY(0.35);
  }

  25.35%,
  25.75%,
  74.45%,
  74.85% {
    transform: scaleY(0.08);
  }

  25.2%,
  74.3% {
    transform: scaleY(0.16);
  }
}
</style>
