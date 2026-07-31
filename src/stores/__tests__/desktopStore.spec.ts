import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { defaultWorkspaceInfo } from '@/types/workspace'

describe('workspaceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('keeps info in sync when adding workspaces', () => {
    const store = useWorkspaceStore()

    store.addWorkspace([])
    store.addWorkspace([], { title: 'Second workspace' })

    expect(store.workspaces).toHaveLength(3)
    expect(store.info).toHaveLength(3)
    expect(store.info[2]?.title).toBe('Second workspace')
  })

  it('removes matching info entry when deleting workspace', () => {
    const store = useWorkspaceStore()

    store.addWorkspace([], { title: 'Second workspace' })
    store.removeWorkspace(0)

    expect(store.workspaces).toHaveLength(1)
    expect(store.info).toHaveLength(1)
    expect(store.info[0]?.title).toBe('Second workspace')
  })

  it('moves info together with workspace order', () => {
    const store = useWorkspaceStore()

    store.updateWorkspaceInfo(0, { title: 'First workspace' })
    store.addWorkspace([], { title: 'Second workspace' })

    store.moveWorkspaceRight(0)
    expect(store.info[0]?.title).toBe('Second workspace')
    expect(store.info[1]?.title).toBe('First workspace')

    store.moveWorkspaceLeft(1)
    expect(store.info[0]?.title).toBe('First workspace')
    expect(store.info[1]?.title).toBe('Second workspace')
  })

  it('normalizes missing info entries after persistence restore', () => {
    const store = useWorkspaceStore()

    store.workspaces = [[], [], []]
    store.info = []
    store.ensureInfoLength()

    expect(store.info).toHaveLength(3)
    expect(store.info[0]).toEqual(defaultWorkspaceInfo)
  })

  it('ignores removeWorkspace calls with invalid indexes', () => {
    const store = useWorkspaceStore()

    store.updateWorkspaceInfo(0, { title: 'Only workspace' })
    store.removeWorkspace(-1)
    store.removeWorkspace(99)

    expect(store.workspaces).toHaveLength(1)
    expect(store.info).toHaveLength(1)
    expect(store.info[0]?.title).toBe('Only workspace')
  })

  it('does not move workspace left when already at the first index', () => {
    const store = useWorkspaceStore()

    store.updateWorkspaceInfo(0, { title: 'First workspace' })
    store.addWorkspace([], { title: 'Second workspace' })

    store.moveWorkspaceLeft(0)

    expect(store.info[0]?.title).toBe('First workspace')
    expect(store.info[1]?.title).toBe('Second workspace')
  })

  it('does not move workspace right when already at the last index', () => {
    const store = useWorkspaceStore()

    store.updateWorkspaceInfo(0, { title: 'First workspace' })
    store.addWorkspace([], { title: 'Second workspace' })

    store.moveWorkspaceRight(1)

    expect(store.info[0]?.title).toBe('First workspace')
    expect(store.info[1]?.title).toBe('Second workspace')
  })

  it('safely ignores updateWidget when workspace or widget is missing', () => {
    const store = useWorkspaceStore()

    store.workspaces = [
      [
        {
          i: 'widget-1',
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          tile: 'stat',
          props: { title: 'Users' },
        },
      ],
    ]

    store.updateWidget(0, 'missing-widget', { title: 'Updated' })
    store.updateWidget(3, 'widget-1', { title: 'Updated' })

    expect(store.workspaces[0]?.[0]?.props).toEqual({ title: 'Users' })
  })
})
