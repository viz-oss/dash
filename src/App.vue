<script setup lang="ts">
import WorkspaceNav from './components/WorkspaceNav.vue'
import Card from './components/Card.vue'
</script>

<template>
  <WorkspaceNav 
    icon="fa-regular fa-face-smile"
  />
  <!-- <Card 
    icon="fas fa-shopping-cart"
    title="Sales" 
    value="$4,850" 
    changeValue="- 3%" 
    :isUp="false" 
    periodText="vs last month"
  /> -->
</template>

<style>
:root {
  --bg-color: rgb(249, 250, 254);
  --key-color-lighter: rgb(241, 237, 254);
  --key-color-light: rgb(230, 221, 253);
  --key-color-dark: rgb(112, 65, 250);
  --x1-color-light: rgb(228, 238, 253);
  --x1-color-dark: rgb(104, 167, 253);
  --white-color: rgb(254, 254, 254);
  --font-color-dark: rgb(20, 36, 62);
  --font-color-light: rgb(137, 149, 169);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  min-height: 100vh;
  margin: 0;
  background-image: url('/public/dash-concept.png'); /* TODO: REMOVE */
  background-size: cover; /* TODO: REMOVE */
  background-position: center; /* TODO: REMOVE */
  background-repeat: no-repeat; /* TODO: REMOVE */
}

#app {
  padding: 53px 16px 0px 16px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, var(--bg-color) 100px, transparent 100px); /* TODO: REMOVE */
}

.widget-full {
  width: calc(100% - 32px);
}
</style>
