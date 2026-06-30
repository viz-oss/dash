import { defineStore } from 'pinia'
import type { DesktopLayout } from '@/types/desktop'

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
    }
  },

  persist: true,
})