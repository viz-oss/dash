<script setup lang="ts"></script>

<template>
  <div class="icon">
    <!-- <i class="fa-solid fa-chevron-down"></i> TODO: jak nie będę robił tutaj dropdown to użyć icon -->
    <i class="fa-regular fa-pen-to-square"></i>
  </div>
</template>

<style scoped>
.icon {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--font-color-dark);
  background-color: var(--white-color);
  margin: 2px;
  box-shadow: 0 0 4px var(--shadow-color);
}
</style>
