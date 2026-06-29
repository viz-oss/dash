<script setup lang="ts">
import { ref } from 'vue'
import { useEditmodeStore } from '@/stores/editmode'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import LandscapeSettings from '@/views/sheets/LandscapeSettings.vue'

defineProps({
  id: {
    type: String,
    required: false,
    default: () => `landscape-${crypto.randomUUID()}`,
  },
  theme: {
    type: String,
    required: false,
    default: 'mountains',
  },
  thumb: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`
const emit = defineEmits(['remove'])
const sheet = ref<{ open: () => void; close: () => void } | null>(null)

</script>

<template>
  <div
    :class="[
      'card',
      'full',
      !thumb && editmodeStore.editmode ? 'editmode' : '',
      thumb ? 'thumb' : '',
    ]"
    :style="{ '--float-delay': randomFloatDelay }"
    @click="!thumb && editmodeStore.editmode ? sheet?.open() : null"
  >
    <i
      v-if="!thumb && editmodeStore.editmode"
      class="close fa-solid fa-xmark"
      @click="emit('remove')"
    ></i>
    <img v-bind:src="`/public/_landscape-${theme}.png`" />
    <VueBottomSheet ref="sheet">
      <LandscapeSettings />
    </VueBottomSheet>
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

.thumb.card {
  background-color: var(--white-color);
  box-shadow: 0 0 4px var(--shadow-color);
}

.thumb.card img {
  object-fit: contain;
}
</style>
