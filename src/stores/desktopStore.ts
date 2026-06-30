import { defineStore } from 'pinia'
import type { WidgetProps, DesktopLayout } from '@/types/desktop'

export const useDesktopStore = defineStore('desktop', {
  state: () => ({
    desktops: [[]] as DesktopLayout[]
  }),

  actions: {
    addDesktop(newDesktop: DesktopLayout = []) {
      this.desktops.push(newDesktop)
    },

    updateDesktop(index: number, updatedLayout: DesktopLayout) {
      if (this.desktops[index]) {
        this.desktops[index] = updatedLayout
      }
    },

    updateWidget(desktopIndex: number, widgetId: string | number, newProps: WidgetProps) {
      const desktop = this.desktops[desktopIndex]
      if (!desktop) return

      const widget = desktop.find(item => item.i === widgetId)
      if (widget) {
        widget.props = {
          ...widget.props,
          ...newProps
        }
      }
    },

  },

  persist: true,
})