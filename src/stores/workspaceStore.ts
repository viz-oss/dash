import { defineStore } from 'pinia'
import { defaultWorkspaceInfo } from '@/types/workspace'
import type { WidgetProps, WorkspaceLayout, WorkspaceInfo } from '@/types/workspace'

function createDefaultWorkspaceInfo(overrides: Partial<WorkspaceInfo> = {}): WorkspaceInfo {
  return {
    ...defaultWorkspaceInfo,
    ...overrides,
  }
}

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    workspaces: [[]] as WorkspaceLayout[],
    info: [createDefaultWorkspaceInfo()] as WorkspaceInfo[],
  }),

  actions: {
    ensureInfoLength() {
      while (this.info.length < this.workspaces.length) {
        this.info.push(createDefaultWorkspaceInfo())
      }

      if (this.info.length > this.workspaces.length) {
        this.info.splice(this.workspaces.length)
      }

      if (this.workspaces.length === 0) {
        this.workspaces.push([])
      }

      if (this.info.length === 0) {
        this.info.push(createDefaultWorkspaceInfo())
      }
    },

    addWorkspace(newWorkspace: WorkspaceLayout = [], newInfo: Partial<WorkspaceInfo> = {}) {
      this.workspaces.push(newWorkspace)
      this.info.push(createDefaultWorkspaceInfo(newInfo))
    },

    removeWorkspace(index: number) {
      if (index < 0 || index >= this.workspaces.length) return

      this.workspaces.splice(index, 1)
      this.info.splice(index, 1)
      this.ensureInfoLength()
    },

    moveWorkspaceLeft(index: number) {
      if (index <= 0 || index >= this.workspaces.length) return

      const left = index - 1
      const layoutTemp = this.workspaces[left]!
      this.workspaces[left] = this.workspaces[index]!
      this.workspaces[index] = layoutTemp

      const infoTemp = this.info[left]!
      this.info[left] = this.info[index]!
      this.info[index] = infoTemp
    },

    moveWorkspaceRight(index: number) {
      if (index < 0 || index >= this.workspaces.length - 1) return

      const right = index + 1
      const layoutTemp = this.workspaces[right]!
      this.workspaces[right] = this.workspaces[index]!
      this.workspaces[index] = layoutTemp

      const infoTemp = this.info[right]!
      this.info[right] = this.info[index]!
      this.info[index] = infoTemp
    },

    updateWorkspaceInfo(index: number, updatedInfo: Partial<WorkspaceInfo>) {
      if (!this.info[index]) {
        this.info[index] = createDefaultWorkspaceInfo()
      }

      this.info[index] = {
        ...this.info[index],
        ...updatedInfo,
      }
    },

    updateWorkspace(index: number, updatedLayout: WorkspaceLayout) {
      if (this.workspaces[index]) {
        this.workspaces[index] = updatedLayout
      }
    },

    updateWidget(workspaceIndex: number, widgetId: string | number, newProps: WidgetProps) {
      const workspace = this.workspaces[workspaceIndex]
      if (!workspace) return

      const widget = workspace.find((item) => item.i === widgetId)
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
