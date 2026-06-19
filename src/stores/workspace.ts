import { defineStore } from 'pinia'

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    icon: 'fa-regular fa-face-smile',
    title: 'Workspace name',
    description: 'More detailed project description',
  }),
  actions: {
    update({ icon, title, description }: { icon: string; title: string; description: string }) {
      this.icon = icon
      this.title = title
      this.description = description
    },
  },
  persist: true,
})
