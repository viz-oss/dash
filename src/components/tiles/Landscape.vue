<script setup lang="ts">
import { useEditmodeStore } from '@/stores/editmode'

defineProps({
  id: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
})

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`
const emit = defineEmits(['remove'])
</script>

<template>
  <div
    :class="'card full' + (editmodeStore.editmode ? ' editmode' : '')"
    :style="{ '--float-delay': randomFloatDelay }"
  >
    <i v-if="editmodeStore.editmode" class="close fa-solid fa-xmark"></i>
    <img v-bind:src="`/public/_landscape-${theme}.png`" />
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  height: 100%;
  background-color: transparent;
  box-shadow: none;
  padding: 0;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
</style>
