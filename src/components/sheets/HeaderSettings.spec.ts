import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HeaderSettings from './HeaderSettings.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

describe('HeaderSettings', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const workspaceStore = useWorkspaceStore()
    workspaceStore.workspaces = [
      [
        {
          i: 'header-1',
          x: 0,
          y: 0,
          w: 3,
          h: 1,
          tile: 'header',
          props: {
            title: 'Initial title',
            subtitle: 'Initial subtitle',
          },
        },
      ],
    ]
  })

  it('prefills form with widget props from store', () => {
    const wrapper = mount(HeaderSettings, {
      props: {
        widgetId: 'header-1',
      },
    })

    const inputs = wrapper.findAll('input')
    expect((inputs[0]?.element as HTMLInputElement).value).toBe('Initial title')
    expect((inputs[1]?.element as HTMLInputElement).value).toBe('Initial subtitle')
  })

  it('calls updateWidget and emits close on save', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(HeaderSettings, {
      props: {
        widgetId: 'header-1',
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0]?.setValue('Updated title')
    await inputs[1]?.setValue('Updated subtitle')
    await wrapper.find('.btn-primary').trigger('click')

    expect(updateWidgetSpy).toHaveBeenCalledWith(0, 'header-1', {
      title: 'Updated title',
      subtitle: 'Updated subtitle',
    })
    expect(wrapper.emitted('close')).toEqual([[]])
  })

  it('emits close without saving when cancel is clicked', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(HeaderSettings, {
      props: {
        widgetId: 'header-1',
      },
    })

    await wrapper.find('.btn-secondary').trigger('click')

    expect(updateWidgetSpy).not.toHaveBeenCalled()
    expect(wrapper.emitted('close')).toEqual([[]])
  })
})
