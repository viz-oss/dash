<script setup lang="ts">
import { useOS } from '@/composables/useOS'
import { onBeforeUnmount, onMounted, ref } from 'vue'
const { osName } = useOS()

// Cactus eye positioning
const eyeLeft = ref<HTMLElement | null>(null)
const eyeRight = ref<HTMLElement | null>(null)

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })

  if (osName.value === 'ios') {
    if (eyeLeft.value) {
      eyeLeft.value.style.left = '27px'
    }
    if (eyeRight.value) {
      eyeRight.value.style.right = '0px'
    }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)

  if (returnToCenterTimer !== null) {
    clearTimeout(returnToCenterTimer)
    returnToCenterTimer = null
  }
})

/**
 * Move both pupils toward the cursor.
 */

function lookAt(cursorX: number, cursorY: number) {
  updatePupil(eyeLeft.value, cursorX, cursorY)
  updatePupil(eyeRight.value, cursorX, cursorY)
}

/**
 * Update one pupil offset and clamp it to a small radius.
 */

function updatePupil(eye: HTMLElement | null, cursorX: number, cursorY: number) {
  if (!eye) {
    return
  }

  const rect = eye.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const deltaX = cursorX - centerX
  const deltaY = cursorY - centerY
  const distance = Math.hypot(deltaX, deltaY)

  let moveX = 0
  let moveY = 0

  if (distance > 0) {
    const ratio = Math.min(maxPupilOffset / distance, 1)
    moveX = deltaX * ratio
    moveY = deltaY * ratio
  }

  eye.style.setProperty('--pupil-x', `${moveX.toFixed(2)}px`)
  eye.style.setProperty('--pupil-y', `${moveY.toFixed(2)}px`)
}

/**
 * Return pupils to center after brief mouse inactivity.
 */

function scheduleReturnToCenter() {
  if (returnToCenterTimer) {
    clearTimeout(returnToCenterTimer)
  }

  returnToCenterTimer = setTimeout(() => {
    centerPupil(eyeLeft.value)
    centerPupil(eyeRight.value)
    returnToCenterTimer = null
  }, returnToCenterDelay)
}

/**
 * Reset one pupil offset to center.
 */

function centerPupil(eye: HTMLElement | null) {
  if (!eye) {
    return
  }

  eye.style.setProperty('--pupil-x', '0px')
  eye.style.setProperty('--pupil-y', '0px')
}

// Pupils follow the cursor with a small bounded offset.
const maxPupilOffset = 2.8
const returnToCenterDelay = 800
let returnToCenterTimer: ReturnType<typeof setTimeout> | null = null
const onMouseMove = (event: MouseEvent) => {
  lookAt(event.clientX, event.clientY)
  scheduleReturnToCenter()
}
</script>

<template>
  <div class="card">
    <div class="cactus">
      🌵
      <div ref="eyeLeft" class="eye left"></div>
      <div ref="eyeRight" class="eye right"></div>
    </div>
  </div>
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
  transition: transform 100ms ease-out;
}
</style>
