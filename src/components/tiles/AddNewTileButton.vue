<script setup lang="ts">
import { ref } from 'vue'
import RoundButton from '@/components/base/RoundButton.vue'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import AddNewTileSheet from '@/views/sheets/AddNewTileSheet.vue'

const sheet = ref<{ open: () => void; close: () => void } | null>(null)

</script>

<template>
  <RoundButton @click="sheet?.open()" />
  <VueBottomSheet ref="sheet">
    <AddNewTileSheet @close="sheet?.close()" />
  </VueBottomSheet>
</template>

<style scoped>
.round-button {
  width: 100%;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>