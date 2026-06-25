<script setup lang="ts"></script>

<template>
  <nav class="card navbar">
    <span class="dot fill"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid var(--font-color-light);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  outline: none;
}

.dot.fill {
  background: var(--font-color-light);
}
</style>
