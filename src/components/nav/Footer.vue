<script setup lang="ts">
import packageJson from '../../../package.json'

const version = packageJson.version
</script>

<template>
  <footer class="app-footer">
    <span class="app-footer__label">DASH v{{ version }}</span>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  color: var(--font-color-light);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.app-footer__label {
  font-weight: 600;
}
</style>
