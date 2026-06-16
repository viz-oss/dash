<script setup lang="ts">
import { ref, type Component } from 'vue'
import { GridItem, GridLayout } from 'grid-layout-plus'
import type { Layout } from 'grid-layout-plus'
import WorkspaceNav from './components/WorkspaceNav.vue'
import TrendChart from './components/TrendChart.vue'
import StatCard from './components/StatCard.vue'
import RingChart from './components/RingChart.vue'
import AgentAvatar from './components/AgentAvatar.vue'
import Landscape from './components/Landscape.vue'
import { useEditmodeStore } from './stores/editmode'

type TileDefinition = {
  component: Component
  props?: Record<string, unknown>
}

const editmodeStore = useEditmodeStore()

const tileDefinitions: Record<string, TileDefinition> = {
  workspace: {
    component: WorkspaceNav,
    props: {
      title: 'Project Name',
      username: 'Tester',
      description: 'Workspace for testing purposes',
    },
  },
  trend: {
    component: TrendChart,
    props: {
      title: 'Overview',
    },
  },
  users: {
    component: StatCard,
    props: {
      icon: 'fa-regular fa-user',
      title: 'Users',
      value: '1,248',
      changeValue: '12%',
      isUp: true,
      tone: 'x1',
    },
  },
  conversions: {
    component: StatCard,
    props: {
      icon: 'fa-solid fa-filter',
      title: 'Conversions',
      value: '320',
      changeValue: '8%',
      isUp: true,
      tone: 'x2',
    },
  },
  avgTime: {
    component: StatCard,
    props: {
      icon: 'fa-regular fa-clock',
      title: 'Avg. time',
      value: '4m 32s',
      changeValue: '5%',
      isUp: false,
      tone: 'x3',
    },
  },
  ring: {
    component: RingChart,
    props: {
      title: "Company's wiki",
      series: { 'finished writing': 81, 'team use': 32 },
    },
  },
  agent: {
    component: AgentAvatar,
    props: {
      hint: '2 new articles',
    },
  },
  landscape: {
    component: Landscape,
    props: {
      theme: 'mountains',
    },
  },
}

const layout = ref<Layout>([
  { i: 'workspace', x: 0, y: 0, w: 3, h: 1, static: true },
  { i: 'trend', x: 0, y: 1, w: 3, h: 3 },
  { i: 'users', x: 0, y: 4, w: 1, h: 2 },
  { i: 'conversions', x: 1, y: 4, w: 1, h: 2 },
  { i: 'avgTime', x: 2, y: 4, w: 1, h: 2 },
  { i: 'ring', x: 0, y: 6, w: 2, h: 2 },
  { i: 'agent', x: 2, y: 6, w: 1, h: 2 },
  { i: 'landscape', x: 0, y: 8, w: 3, h: 5 },
])
</script>

<template>
  <GridLayout
    v-model:layout="layout"
    :col-num="3"
    :row-height="50"
    :margin="[4, 16]"
    :is-draggable="editmodeStore.editmode"
    :is-resizable="false"
    :prevent-collision="false"
    :vertical-compact="false"
    :use-css-transforms="true"
    :responsive="false"
    class="dashboard-grid"
  >
    <GridItem
      v-for="item in layout"
      :key="item.i"
      v-bind="item"
      drag-ignore-from=".close, .bottom-sheet, .chat"
    >
      <div class="tile-frame" :class="{ 'tile-frame--drag': editmodeStore.editmode }">
        <component
          :is="tileDefinitions[String(item.i)]?.component"
          v-bind="tileDefinitions[String(item.i)]?.props"
        />
      </div>
    </GridItem>
  </GridLayout>
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
}

#app {
  width: calc(100% - 16px);
  padding: 0 8px;
}

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
  background-color: var(--font-color-dark);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

</style>
