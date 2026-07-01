<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: 'fa-regular fa-face-smile',
  },
  text: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="icon">
    <i :class="[icon, 'user-icon']"></i>
    <span v-if="text" class="text">{{ text }}</span>
  </div>
</template>

<style scoped>
.icon {
  min-width: 15px;
  height: 35px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 18px;
  color: var(--key-color-dark);
  background-color: var(--key-color-light);
  padding: 0 10px;
}

.icon {
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.icon .text {
  font-size: 14px;
  font-weight: 500;
}
</style>
