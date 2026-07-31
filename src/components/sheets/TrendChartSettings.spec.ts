import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TrendChartSettings from './TrendChartSettings.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

describe('TrendChartSettings', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const workspaceStore = useWorkspaceStore()
    workspaceStore.workspaces = [
      [
        {
          i: 'trend-1',
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          tile: 'trend',
          props: {
            title: 'Overview',
            url: 'curl https://example.com/trend',
          },
        },
      ],
    ]
  })

  it('prefills title and url from widget props', () => {
    const wrapper = mount(TrendChartSettings, { props: { widgetId: 'trend-1' } })
    const inputs = wrapper.findAll('input')

    expect((inputs[0]?.element as HTMLInputElement).value).toBe('Overview')
    expect((inputs[1]?.element as HTMLInputElement).value).toBe('curl https://example.com/trend')
  })

  it('updates widget and emits close on save', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(TrendChartSettings, { props: { widgetId: 'trend-1' } })
    const inputs = wrapper.findAll('input')

    await inputs[0]?.setValue('Updated trend')
    await inputs[1]?.setValue('curl https://new.example.com/trend')
    await wrapper.find('.btn-primary').trigger('click')

    expect(updateWidgetSpy).toHaveBeenCalledWith(0, 'trend-1', {
      title: 'Updated trend',
      url: 'curl https://new.example.com/trend',
    })
    expect(wrapper.emitted('close')).toEqual([[]])
  })
})
