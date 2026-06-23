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
  thumb: {
    type: Boolean,
    default: false,
  },
})

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`
const emit = defineEmits(['remove'])
</script>

<template>
  <div
    :class="['card', 'full', !thumb && editmodeStore.editmode ? 'editmode' : '', thumb ? 'thumb' : '']"
    :style="{ '--float-delay': randomFloatDelay }"
  >
    <i
      v-if="!thumb && editmodeStore.editmode"
      class="close fa-solid fa-xmark"
      @click="emit('remove')"
    ></i>
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
