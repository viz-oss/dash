import { defineStore } from 'pinia'
import { defaultDesktopInfo } from '@/types/desktop'
import type { WidgetProps, DesktopLayout, DesktopInfo } from '@/types/desktop'

function createDefaultDesktopInfo(overrides: Partial<DesktopInfo> = {}): DesktopInfo {
  return {
    ...defaultDesktopInfo,
    ...overrides,
  }
}

export const useDesktopStore = defineStore('desktop', {
  state: () => ({
    desktops: [[]] as DesktopLayout[],
    info: [createDefaultDesktopInfo()] as DesktopInfo[],
  }),

  actions: {
    ensureInfoLength() {
      while (this.info.length < this.desktops.length) {
        this.info.push(createDefaultDesktopInfo())
      }

      if (this.info.length > this.desktops.length) {
        this.info.splice(this.desktops.length)
      }

      if (this.desktops.length === 0) {
        this.desktops.push([])
      }

      if (this.info.length === 0) {
        this.info.push(createDefaultDesktopInfo())
      }
    },

    addDesktop(newDesktop: DesktopLayout = [], newInfo: Partial<DesktopInfo> = {}) {
      this.desktops.push(newDesktop)
      this.info.push(createDefaultDesktopInfo(newInfo))
    },

    removeDesktop(index: number) {
      if (index < 0 || index >= this.desktops.length) return

      this.desktops.splice(index, 1)
      this.info.splice(index, 1)
      this.ensureInfoLength()
    },

    moveDesktopLeft(index: number) {
      if (index <= 0 || index >= this.desktops.length) return

      const left = index - 1
      const layoutTemp = this.desktops[left]!
      this.desktops[left] = this.desktops[index]!
      this.desktops[index] = layoutTemp

      const infoTemp = this.info[left]!
      this.info[left] = this.info[index]!
      this.info[index] = infoTemp
    },

    moveDesktopRight(index: number) {
      if (index < 0 || index >= this.desktops.length - 1) return

      const right = index + 1
      const layoutTemp = this.desktops[right]!
      this.desktops[right] = this.desktops[index]!
      this.desktops[index] = layoutTemp

      const infoTemp = this.info[right]!
      this.info[right] = this.info[index]!
      this.info[index] = infoTemp
    },

    updateDesktopInfo(index: number, updatedInfo: Partial<DesktopInfo>) {
      if (!this.info[index]) {
        this.info[index] = createDefaultDesktopInfo()
      }

      this.info[index] = {
        ...this.info[index],
        ...updatedInfo,
      }
    },

    updateDesktop(index: number, updatedLayout: DesktopLayout) {
      if (this.desktops[index]) {
        this.desktops[index] = updatedLayout
      }
    },

    updateWidget(desktopIndex: number, widgetId: string | number, newProps: WidgetProps) {
      const desktop = this.desktops[desktopIndex]
      if (!desktop) return

      const widget = desktop.find((item) => item.i === widgetId)
      if (widget) {
        widget.props = {
          ...widget.props,
          ...newProps,
        }
      }
    },
  },

  persist: true,
})
