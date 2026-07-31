import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LandscapeSettings from './LandscapeSettings.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

describe('LandscapeSettings', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const workspaceStore = useWorkspaceStore()
    workspaceStore.workspaces = [
      [
        {
          i: 'landscape-1',
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          tile: 'landscape',
          props: {
            theme: 'mountains',
          },
        },
      ],
    ]
  })

  it('renders all predefined landscape cards', () => {
    const wrapper = mount(LandscapeSettings, { props: { widgetId: 'landscape-1' } })

    expect(wrapper.findAll('.landscape-options .card')).toHaveLength(9)
    expect(wrapper.find('.card.selected').attributes('data-theme')).toBe('mountains')
  })

  it('updates selected theme on save after card click', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(LandscapeSettings, { props: { widgetId: 'landscape-1' } })

    const oceanCard = wrapper.find('.card[data-theme="ocean"]')
    await oceanCard.trigger('click')
    await wrapper.find('.btn-primary').trigger('click')

    expect(updateWidgetSpy).toHaveBeenCalledWith(0, 'landscape-1', {
      theme: 'ocean',
    })
    expect(wrapper.emitted('close')).toEqual([[]])
  })

  it('emits close without updating on cancel', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(LandscapeSettings, { props: { widgetId: 'landscape-1' } })

    await wrapper.find('.btn-secondary').trigger('click')

    expect(updateWidgetSpy).not.toHaveBeenCalled()
    expect(wrapper.emitted('close')).toEqual([[]])
  })
})
