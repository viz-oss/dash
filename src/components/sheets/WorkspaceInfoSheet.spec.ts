import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import WorkspaceInfoSheet from './WorkspaceInfoSheet.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

describe('WorkspaceInfoSheet', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const workspaceStore = useWorkspaceStore()
    workspaceStore.info = [
      {
        icon: 'fa-solid fa-rocket',
        title: 'Main workspace',
        description: 'Primary dashboard',
      },
      {
        icon: 'fa-solid fa-ship',
        title: 'Backup workspace',
        description: 'Secondary dashboard',
      },
    ]
  })

  it('prefills form from selected workspace info', () => {
    const wrapper = mount(WorkspaceInfoSheet, {
      props: { workspaceIndex: 1 },
      global: {
        stubs: {
          IconPicker: true,
        },
      },
    })

    const inputs = wrapper.findAll('input')
    expect((inputs[0]?.element as HTMLInputElement).value).toBe('Backup workspace')
    expect((inputs[1]?.element as HTMLInputElement).value).toBe('Secondary dashboard')
  })

  it('updates workspace info and emits close on save', async () => {
    const workspaceStore = useWorkspaceStore()
    const updateWorkspaceInfoSpy = vi.spyOn(workspaceStore, 'updateWorkspaceInfo')

    const wrapper = mount(WorkspaceInfoSheet, {
      props: { workspaceIndex: 0 },
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

    const inputs = wrapper.findAll('input')
    await inputs[0]?.setValue('Renamed workspace')
    await inputs[1]?.setValue('Updated description')
    await wrapper.find('.icon-picker-stub').trigger('click')
    await wrapper.find('.btn-primary').trigger('click')

    expect(updateWorkspaceInfoSpy).toHaveBeenCalledWith(0, {
      icon: 'fa-solid fa-star',
      title: 'Renamed workspace',
      description: 'Updated description',
    })
    expect(wrapper.emitted('close')).toEqual([[]])
  })
})
