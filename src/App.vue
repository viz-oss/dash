<script setup lang="ts">
import MainScreen from '@/views/MainScreen.vue'
</script>

<template>
  <MainScreen />
</template>

<style>
:root {
  --shadow-color: rgba(0, 0, 0, 0.07);
  --bg-color: rgb(249, 250, 254);
  --key-color-lighter: rgb(241, 237, 254);
  --key-color-light: rgb(230, 221, 253);
  --key-color-dark: rgb(112, 65, 250);
  --x1-color-light: rgb(228, 238, 253);
  --x1-color-dark: rgb(104, 167, 253);
  --x2-color-light: rgb(232, 249, 240);
  --x2-color-dark: rgb(45, 198, 122);
  --x3-color-light: rgb(254, 242, 226);
  --x3-color-dark: rgb(253, 155, 17);
  --white-color: rgb(254, 254, 254);
  --font-color-dark: rgb(20, 36, 62);
  --font-color-light: rgb(137, 149, 169);
  --edit-color: rgb(112, 65, 250);

  --surface: rgba(255, 255, 255, 0.85);
  --border: rgba(120, 130, 170, 0.12);
  --primary-start: #8b5cf6;
  --primary-end: #2563ff;
  --shadow-lg:
      0 20px 60px rgba(15, 23, 42, 0.08),
      0 8px 20px rgba(15, 23, 42, 0.04);
  --shadow-md:
      0 8px 24px rgba(15, 23, 42, 0.06);
  --radius-xl: 32px;
  --radius-lg: 24px;
  --radius-md: 18px;  
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  min-height: 100vh;
  margin: 0;
  -webkit-user-select: none; /* Safari */
  user-select: none;
  overflow-x: hidden;
  scrollbar-width: none;
  overflow-y: scroll;
}

&::-webkit-scrollbar {
  display: none;
}

.allow-select {
  -webkit-user-select: text; /* Safari */
  user-select: text;
}

#app {
  width: calc(100% - 16px);
  padding: 0 8px;
}

/* Grid with tiles */

.dashboard-grid {
  width: 100%;
}

.tile-frame {
  width: 100%;
  height: 100%;
}

.tile-frame--drag {
  cursor: move;
}

/* Card tile */

.card {
  position: relative;
  background: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 0 4px var(--shadow-color);
  text-align: left;
  width: 100%;
  height: 100%;
  padding: 10px 14px;
  margin-top: 0;
  box-sizing: border-box;
}

.card.double {
  width: 100%;
}

.card.full {
  width: 100%;
}

.card .title {
  font-size: 11px;
  font-weight: 500;
  color: var(--font-color-dark);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.card.editmode {
  animation: float 1s ease-in-out infinite;
  animation-delay: var(--float-delay, 0s);
}

.card .close {
  position: absolute;
  top: -6px;
  left: -6px;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--edit-color);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

/* Bottom Sheet */

[data-vsbs-sheet] {
  font-family: Inter, system-ui, sans-serif;
  color: var(--text);
  background: var(--surface);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: var(--shadow-lg);
}

[data-vsbs-header]:before {
  background-color: var(--key-color-light) !important;
  border-radius: 4px !important;
  height: 4px !important;
  width: 32px !important;
  top: 12px !important;
}

.sheet-content {
  width: 100%;
  height: 75vh; /* Using vh for example, assuming 'whole screen' context */
}

.sheet-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 50px;
}

.sheet-header .icon {
  width: 42px;
  height: 46px;
  border-radius: 14px;
  font-size: 23px;
  color: var(--key-color-dark);
  background: linear-gradient(135deg, rgb(166 233 246 / 25%), rgb(183 132 255 / 25%));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 4px 10px rgba(139, 92, 246, 0.2);
  border: 1px solid rgb(79 81 255 / 10%);
  opacity: 0.9;
}

.sheet-header .title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  color: var(--font-color-dark);
}

.sheet-header .subtitle {
  margin-top: 10px;
  color: var(--font-color-light);
  font-size: 12px;
}

/* Form Fields */

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 500;
  color: var(--font-color-dark);
}

.field input,
.field textarea {
  width: calc(100% - 16px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.field textarea {
  resize: vertical;
  min-height: 60px;
}

::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--font-color-light);
}
</style>
