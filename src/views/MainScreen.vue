<script setup lang="ts">
import { ref, type Component } from 'vue'
import { GridItem, GridLayout } from 'grid-layout-plus'
import type { Layout } from 'grid-layout-plus'
import WorkspaceNav from '@/components/WorkspaceNav.vue'
import TrendChart from '@/components/tiles/TrendChart.vue'
import StatCard from '@/components/tiles/StatCard.vue'
import RingChart from '@/components/tiles/RingChart.vue'
import AgentAvatar from '@/components/tiles/AgentAvatar.vue'
import Landscape from '@/components/tiles/Landscape.vue'
import AddNewTileButton from '@/components/tiles/AddNewTileButton.vue'
import { useEditmodeStore } from '@/stores/editmode'

type TileDefinition = {
  component: Component
  props?: Record<string, unknown>
}

const editmodeStore = useEditmodeStore()
const tileDefinitions: Record<string, TileDefinition> = {
  workspace: {
    component: WorkspaceNav,
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
  { i: 'trend', x: 0, y: 1, w: 3, h: 3, minW: 1, minH: 2, maxW: 3, maxH: 4 },
  { i: 'users', x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 2, maxW: 1, maxH: 2 },
  { i: 'conversions', x: 1, y: 4, w: 1, h: 2, minW: 1, minH: 2, maxW: 1, maxH: 2 },
  { i: 'avgTime', x: 2, y: 4, w: 1, h: 2, minW: 1, minH: 2, maxW: 1, maxH: 2 },
  { i: 'ring', x: 0, y: 6, w: 2, h: 2, minW: 1, minH: 2, maxW: 2, maxH: 2 },
  { i: 'agent', x: 2, y: 6, w: 1, h: 2, minW: 1, minH: 2, maxW: 1, maxH: 2 },
  { i: 'landscape', x: 0, y: 8, w: 3, h: 3, minW: 1, minH: 2, maxW: 3, maxH: 4 },
])

function removeTile(id: string | number) {
  if (confirm('Are you sure you want to remove this tile?')) {
    layout.value = layout.value.filter((item) => item.i !== id)
  }
}
</script>

<template>
  <GridLayout
    v-model:layout="layout"
    :col-num="3"
    :row-height="50"
    :margin="[4, 16]"
    :is-draggable="editmodeStore.editmode"
    :is-resizable="editmodeStore.editmode"
    :prevent-collision="false"
    :vertical-compact="false"
    :use-css-transforms="true"
    :responsive="false"
    class="dashboard-grid"
    :class="editmodeStore.editmode ? 'editmode' : ''"
  >
    <GridItem
      v-for="item in layout"
      :key="item.i"
      v-bind="item"
      drag-ignore-from=".close, .bottom-sheet, .chat"
    >
      <div class="tile-frame" :class="{ 'tile-frame--drag': editmodeStore.editmode }">
        <component
          :id="item.i"
          :is="tileDefinitions[String(item.i)]?.component"
          v-bind="tileDefinitions[String(item.i)]?.props"
          @remove="removeTile(item.i)"
        />
      </div>
    </GridItem>
  </GridLayout>
  <AddNewTileButton v-if="editmodeStore.editmode" />
</template>

<style>
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
</style>
