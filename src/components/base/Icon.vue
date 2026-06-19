<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: 'fa-regular fa-face-smile'
  },
})
</script>

<template>
  <div class="icon">
    <i :class="[icon, 'user-icon']"></i>
  </div>
</template>

<style scoped>
.icon {
  width: 35px;
  height: 35px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--key-color-dark);
  background-color: var(--key-color-light);
}
</style>