<script setup lang="ts">
import Icon from '@/components/base/Icon.vue'

defineProps({
  icons: {
    type: Array as () => string[],
    default: () => [],
  },
})
</script>

<template>
  <div class="icon-picker">
    <div v-for="(icon, index) in icons" :key="index" class="icon-option">
      <Icon :icon="icon" />
    </div>
  </div>
</template>

<style scoped>
.icon-picker {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 6px;
  width: calc(100% - 30px);
  padding: 13px 15px;
  border: 1px solid rgba(132, 145, 186, 0.2);
  border-radius: 10px;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.02),
    0 4px 12px rgba(15, 23, 42, 0.03);
}

.icon {
  cursor: pointer;
}
</style>
