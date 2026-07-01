import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDesktopStore } from '@/stores/desktopStore'
import { defaultDesktopInfo } from '@/types/desktop'

describe('desktopStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('keeps info in sync when adding desktops', () => {
    const store = useDesktopStore()

    store.addDesktop([])
    store.addDesktop([], { title: 'Second desktop' })

    expect(store.desktops).toHaveLength(3)
    expect(store.info).toHaveLength(3)
    expect(store.info[2]?.title).toBe('Second desktop')
  })

  it('removes matching info entry when deleting desktop', () => {
    const store = useDesktopStore()

    store.addDesktop([], { title: 'Second desktop' })
    store.removeDesktop(0)

    expect(store.desktops).toHaveLength(1)
    expect(store.info).toHaveLength(1)
    expect(store.info[0]?.title).toBe('Second desktop')
  })

  it('moves info together with desktop order', () => {
    const store = useDesktopStore()

    store.updateDesktopInfo(0, { title: 'First desktop' })
    store.addDesktop([], { title: 'Second desktop' })

    store.moveDesktopRight(0)
    expect(store.info[0]?.title).toBe('Second desktop')
    expect(store.info[1]?.title).toBe('First desktop')

    store.moveDesktopLeft(1)
    expect(store.info[0]?.title).toBe('First desktop')
    expect(store.info[1]?.title).toBe('Second desktop')
  })

  it('normalizes missing info entries after persistence restore', () => {
    const store = useDesktopStore()

    store.desktops = [[], [], []]
    store.info = []
    store.ensureInfoLength()

    expect(store.info).toHaveLength(3)
    expect(store.info[0]).toEqual(defaultDesktopInfo)
  })
})
