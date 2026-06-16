<script setup lang="ts">
import { useEditmodeStore } from '../stores/editmode'

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`

defineProps<{
  theme: 'mountains' | 'sea' | 'city'
}>()
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
  height: auto;
  background-color: transparent;
  box-shadow: none;
  padding: 0;
  margin-top: 20px;
}

.card img {
  width: 100%;
  height: auto;
}
</style>
