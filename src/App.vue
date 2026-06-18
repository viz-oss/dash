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

.sheet-content {
  width: 100%;
  height: 75vh; /* Using vh for example, assuming 'whole screen' context */
}

.sheet-content h2 {
  font-size: 17px;
  margin-top: 0;
  margin-bottom: 24px;
  color: var(--font-color-dark);
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
