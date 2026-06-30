import type { LayoutItem } from 'grid-layout-plus'
import type { Component } from 'vue'

import TrendChart from '@/components/tiles/TrendChart.vue'
import StatCard from '@/components/tiles/StatCard.vue'
import RingChart from '@/components/tiles/RingChart.vue'
import AgentAvatar from '@/components/tiles/AgentAvatar.vue'
import Landscape from '@/components/tiles/Landscape.vue'

export type DesktopLayoutItem = LayoutItem & {
  tile: string
}

export type DesktopLayout = DesktopLayoutItem[]

type TileDefinition = {
  component: Component
  w?: number
  h?: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

export const tileDefinitions: Record<string, TileDefinition> = {
  trend: { component: TrendChart, w: 3, h: 3, minW: 1, minH: 2, maxW: 3, maxH: 4 },
  stat: { component: StatCard, w: 1, h: 2, minW: 1, minH: 2, maxW: 1, maxH: 2 },
  ring: { component: RingChart, w: 2, h: 2, minW: 1, minH: 2, maxW: 2, maxH: 2 },
  agent: { component: AgentAvatar, w: 1, h: 2, minW: 1, minH: 2, maxW: 1, maxH: 2 },
  landscape: { component: Landscape, w: 3, h: 3, minW: 1, minH: 2, maxW: 3, maxH: 4 },
}
