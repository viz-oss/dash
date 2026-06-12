<script setup lang="ts">
import WorkspaceNav from './components/WorkspaceNav.vue'
import TrendChart from './components/TrendChart.vue'
import StatCard from './components/StatCard.vue'
import RingChart from './components/RingChart.vue'
</script>

<template>
  <WorkspaceNav
    icon="fa-regular fa-face-smile"
    title="Project Name"
    username="Tester"
    description="Workspace for testing purposes"
  />
  <TrendChart title="Overview" />
  <div class="row">
    <StatCard
      icon="fa-regular fa-user"
      title="Users"
      value="1,248"
      changeValue="12%"
      :isUp="true"
    />
    <StatCard
      icon="fa-solid fa-filter"
      title="Conversions"
      value="320"
      changeValue="8%"
      :isUp="true"
    />
    <StatCard
      icon="fa-regular fa-clock"
      title="Avg. time"
      value="4m 32s"
      changeValue="5%"
      :isUp="false"
    />
  </div>
  <div class="row">
    <RingChart />
  </div>
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
  background: linear-gradient(
    to bottom,
    var(--bg-color) 400px,
    transparent 100px
  ); /* TODO: REMOVE */
}

.row {
  display: flex;
  gap: 4px;
}

.card {
  background: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 0 4px var(--shadow-color);
  text-align: left;
  width: calc(32.33% - 20px);
  height: 96px;
  padding: 10px 14px;
}

.card.double {
  width: calc(66.66% - 20px);
}

.card.full {
  width: calc(100% - 32px);
}
</style>
