import type { LayoutItem } from 'grid-layout-plus'
import type { Component } from 'vue'

export type DesktopTileDefinition = {
  component: Component
  props?: Record<string, unknown>
}

export type DesktopLayoutItem = LayoutItem & {
  tile: string
}

export type DesktopLayout = DesktopLayoutItem[]
