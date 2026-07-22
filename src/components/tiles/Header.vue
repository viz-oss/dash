<script setup lang="ts">
import { ref } from 'vue'
import { useEditmodeStore } from '@/stores/editmode'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import HeaderSettings from '@/views/sheets/HeaderSettings.vue'

defineProps({
  id: {
    type: String,
    required: false,
    default: () => `header-${crypto.randomUUID()}`,
  },
  title: {
    type: String,
    required: false,
    default: 'Header',
  },
  subtitle: {
    type: String,
    required: false,
    default: 'Subtitle',
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
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
    <VueBottomSheet ref="sheet">
      <HeaderSettings :widgetId="id" @close="sheet?.close()" />
    </VueBottomSheet>
  </div>
</template>

<style scoped>
.card {
  background: transparent;
  box-shadow: none;
  padding: 0;
  margin: 0;
}

.card.thumb {
  padding: 10px 14px;
}

h1 {
  color: var(--font-color-dark);
  font-size: 24px;
  font-weight: 500;
  text-align: left;
  margin: 0 0 4px 5px;
}

h2 {
  color: var(--font-color-dark);
  font-size: 12px;
  font-weight: 200;
  text-align: left;
  margin: 0 0 0 5px;
}
</style>
