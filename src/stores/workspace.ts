import { defineStore } from 'pinia'

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    title: 'Workspace name',
    description: 'More detailed project description',
  }),
  actions: {
    update({ title, description }: { title: string; description: string }) {
      this.title = title
      this.description = description
    },
  },
  persist: true,
})
