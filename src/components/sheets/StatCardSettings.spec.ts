import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StatCardSettings from './StatCardSettings.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

describe('StatCardSettings', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const workspaceStore = useWorkspaceStore()
    workspaceStore.workspaces = [
      [
        {
          i: 'stat-1',
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          tile: 'stat',
          props: {
            icon: 'fas fa-users',
            title: 'Users',
            value: '$data.count',
            url: 'curl https://example.com',
          },
        },
      ],
    ]
  })

  it('prefills text fields from widget props', () => {
    const wrapper = mount(StatCardSettings, {
      props: { widgetId: 'stat-1' },
      global: {
        stubs: {
          IconPicker: true,
        },
      },
    })

    const inputs = wrapper.findAll('input')

    expect((inputs[0]?.element as HTMLInputElement).value).toBe('Users')
    expect((inputs[1]?.element as HTMLInputElement).value).toBe('$data.count')
    expect((inputs[2]?.element as HTMLInputElement).value).toBe('curl https://example.com')
  })

  it('passes icon value to IconPicker and updates widget on save', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(StatCardSettings, {
      props: { widgetId: 'stat-1' },
      global: {
        stubs: {
          IconPicker: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<button class="icon-picker-stub" @click="$emit(\'update:modelValue\', \'fa-solid fa-star\')">pick</button>',
          },
        },
      },
    })

    await wrapper.find('.icon-picker-stub').trigger('click')

    const inputs = wrapper.findAll('input')
    await inputs[0]?.setValue('Members')
    await inputs[1]?.setValue('$data.total')
    await inputs[2]?.setValue('curl https://new.example.com')
    await wrapper.find('.btn-primary').trigger('click')

    expect(updateWidgetSpy).toHaveBeenCalledWith(0, 'stat-1', {
      icon: 'fa-solid fa-star',
      title: 'Members',
      value: '$data.total',
      url: 'curl https://new.example.com',
    })
    expect(wrapper.emitted('close')).toEqual([[]])
  })
})
