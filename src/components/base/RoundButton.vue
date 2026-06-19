<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: 'fa-solid fa-plus'
  },
})
</script>

<template>
  <div class="round-button">
    <i :class="[icon, 'round-button-icon']"></i>
  </div>
</template>

<style scoped>
.round-button-icon {
  width: 42px;
  height: 42px;
  font-size: 28px;
  border-radius: 50%;
  background-color: var(--edit-color);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>