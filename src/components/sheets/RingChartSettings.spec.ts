import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RingChartSettings from './RingChartSettings.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

describe('RingChartSettings', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const workspaceStore = useWorkspaceStore()
    workspaceStore.workspaces = [
      [
        {
          i: 'ring-1',
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          tile: 'ring',
          props: {
            title: 'Capacity',
            max: '100',
            name1: 'Used',
            value1: '65',
            name2: 'Free',
            value2: '35',
            url: 'curl https://example.com',
          },
        },
      ],
    ]
  })

  it('prefills all ring chart fields from widget props', () => {
    const wrapper = mount(RingChartSettings, { props: { widgetId: 'ring-1' } })
    const inputs = wrapper.findAll('input')

    expect((inputs[0]?.element as HTMLInputElement).value).toBe('Capacity')
    expect((inputs[1]?.element as HTMLInputElement).value).toBe('100')
    expect((inputs[2]?.element as HTMLInputElement).value).toBe('Used')
    expect((inputs[3]?.element as HTMLInputElement).value).toBe('65')
    expect((inputs[4]?.element as HTMLInputElement).value).toBe('Free')
    expect((inputs[5]?.element as HTMLInputElement).value).toBe('35')
    expect((inputs[6]?.element as HTMLInputElement).value).toBe('curl https://example.com')
  })

  it('updates widget and emits close on save', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(RingChartSettings, { props: { widgetId: 'ring-1' } })
    const inputs = wrapper.findAll('input')

    await inputs[0]?.setValue('Updated title')
    await inputs[1]?.setValue('200')
    await inputs[2]?.setValue('A')
    await inputs[3]?.setValue('120')
    await inputs[4]?.setValue('B')
    await inputs[5]?.setValue('80')
    await inputs[6]?.setValue('curl https://new.example.com')
    await wrapper.find('.btn-primary').trigger('click')

    expect(updateWidgetSpy).toHaveBeenCalledWith(0, 'ring-1', {
      title: 'Updated title',
      max: '200',
      name1: 'A',
      value1: '120',
      name2: 'B',
      value2: '80',
      url: 'curl https://new.example.com',
    })
    expect(wrapper.emitted('close')).toEqual([[]])
  })
})
