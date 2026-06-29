import type { LayoutItem } from 'grid-layout-plus'
import type { Component } from 'vue'

import TopNav from '@/components/nav/TopNav.vue'
import TrendChart from '@/components/tiles/TrendChart.vue'
import StatCard from '@/components/tiles/StatCard.vue'
import RingChart from '@/components/tiles/RingChart.vue'
import AgentAvatar from '@/components/tiles/AgentAvatar.vue'
import Landscape from '@/components/tiles/Landscape.vue'

export type DesktopLayoutItem = LayoutItem & {
  tile: string
}

export type DesktopLayout = DesktopLayoutItem[]

export const tileDefinitions: Record<string, Component> = {
  topnav: TopNav,
  trend: TrendChart,
  stat: StatCard,
  ring: RingChart,
  agent: AgentAvatar,
  landscape: Landscape,
}
