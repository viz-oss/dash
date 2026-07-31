import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useEditmodeStore } from '../editmode'

describe('editmode store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with editmode disabled', () => {
    const store = useEditmodeStore()

    expect(store.editmode).toBe(false)
  })

  it('enables editmode after first toggle', () => {
    const store = useEditmodeStore()

    store.toggle()

    expect(store.editmode).toBe(true)
  })

  it('disables editmode after second toggle', () => {
    const store = useEditmodeStore()

    store.toggle()
    store.toggle()

    expect(store.editmode).toBe(false)
  })

  it('stays consistent after multiple toggles', () => {
    const store = useEditmodeStore()

    for (let index = 0; index < 5; index += 1) {
      store.toggle()
    }

    expect(store.editmode).toBe(true)
  })
})
