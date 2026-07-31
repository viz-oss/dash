import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AgentSettings from './AgentSettings.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

describe('AgentSettings', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const workspaceStore = useWorkspaceStore()
    workspaceStore.workspaces = [
      [
        {
          i: 'agent-1',
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          tile: 'agent',
          props: {
            url: 'curl https://example.com',
            systemPrompt: 'You are helpful',
            command: 'hello',
          },
        },
      ],
    ]
  })

  it('prefills form fields from widget props', () => {
    const wrapper = mount(AgentSettings, { props: { widgetId: 'agent-1' } })

    const inputs = wrapper.findAll('input')
    const textarea = wrapper.find('textarea')

    expect((inputs[0]?.element as HTMLInputElement).value).toBe('curl https://example.com')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('You are helpful')
    expect((inputs[1]?.element as HTMLInputElement).value).toBe('hello')
  })

  it('updates widget and emits close on save', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(AgentSettings, { props: { widgetId: 'agent-1' } })

    const inputs = wrapper.findAll('input')
    const textarea = wrapper.find('textarea')

    await inputs[0]?.setValue('curl https://new.example.com')
    await textarea.setValue('Updated prompt')
    await inputs[1]?.setValue('run now')
    await wrapper.find('.btn-primary').trigger('click')

    expect(updateWidgetSpy).toHaveBeenCalledWith(0, 'agent-1', {
      url: 'curl https://new.example.com',
      systemPrompt: 'Updated prompt',
      command: 'run now',
    })
    expect(wrapper.emitted('close')).toEqual([[]])
  })

  it('emits close without updating on cancel', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWidgetSpy = vi.spyOn(workspaceStore, 'updateWidget')

    const wrapper = mount(AgentSettings, { props: { widgetId: 'agent-1' } })

    await wrapper.find('.btn-secondary').trigger('click')

    expect(updateWidgetSpy).not.toHaveBeenCalled()
    expect(wrapper.emitted('close')).toEqual([[]])
  })
})
