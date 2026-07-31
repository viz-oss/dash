import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import WorkspaceSwitcher from './WorkspaceSwitcher.vue'
import { useEditmodeStore } from '@/stores/editmode'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const NavBarStub = defineComponent({
  emits: ['go-to', 'move-left', 'move-right', 'add-next', 'delete-current'],
  template: `
    <div class="navbar-stub">
      <button class="go-to" @click="$emit('go-to', 1)">go-to</button>
      <button class="move-left" @click="$emit('move-left')">move-left</button>
      <button class="move-right" @click="$emit('move-right')">move-right</button>
      <button class="add-next" @click="$emit('add-next')">add-next</button>
      <button class="delete-current" @click="$emit('delete-current')">delete-current</button>
    </div>
  `,
})

async function settleUi(): Promise<void> {
  await Promise.resolve()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await Promise.resolve()
}

describe('WorkspaceSwitcher', () => {
  const observeSpy = vi.fn()
  const disconnectSpy = vi.fn()

  beforeEach(() => {
    setActivePinia(createPinia())
    observeSpy.mockReset()
    disconnectSpy.mockReset()

    class MockIntersectionObserver {
      observe = observeSpy
      disconnect = disconnectSpy

      constructor(
        _callback: IntersectionObserverCallback,
        _options?: IntersectionObserverInit,
      ) {}
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: vi.fn(),
      configurable: true,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function mountSwitcher() {
    const workspaceStore = useWorkspaceStore()

    return mount(WorkspaceSwitcher, {
      props: {
        workspaces: workspaceStore.workspaces,
      },
      slots: {
        default: '<div class="workspace-slot">slot</div>',
      },
      global: {
        stubs: {
          NavBar: NavBarStub,
        },
      },
    })
  }

  it('renders one workspace container per workspace', async () => {
    const workspaceStore = useWorkspaceStore()
    workspaceStore.addWorkspace([])

    const wrapper = mountSwitcher()
    await settleUi()

    expect(wrapper.findAll('.workspace')).toHaveLength(2)
    expect(wrapper.findAll('.workspace-slot')).toHaveLength(2)
  })

  it('shows navbar when there are multiple workspaces', async () => {
    const workspaceStore = useWorkspaceStore()
    workspaceStore.addWorkspace([])

    const wrapper = mountSwitcher()
    await settleUi()

    expect(wrapper.find('.navbar-stub').exists()).toBe(true)
  })

  it('hides navbar with one workspace when edit mode is disabled', async () => {
    const wrapper = mountSwitcher()
    await settleUi()

    expect(wrapper.find('.navbar-stub').exists()).toBe(false)
  })

  it('shows navbar with one workspace when edit mode is enabled', async () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountSwitcher()
    await settleUi()

    expect(wrapper.find('.navbar-stub').exists()).toBe(true)
  })

  it('emits change when go-to is triggered from navbar', async () => {
    const workspaceStore = useWorkspaceStore()
    workspaceStore.addWorkspace([])

    const wrapper = mountSwitcher()
    await settleUi()

    await wrapper.find('.go-to').trigger('click')

    expect(wrapper.emitted('change')).toEqual([[1]])
  })

  it('adds new workspace and navigates to it', async () => {
    const workspaceStore = useWorkspaceStore()
    workspaceStore.addWorkspace([])

    const wrapper = mountSwitcher()
    await settleUi()

    await wrapper.find('.add-next').trigger('click')
    await settleUi()

    expect(workspaceStore.workspaces).toHaveLength(3)
    expect(wrapper.findAll('.workspace')).toHaveLength(3)
    expect(wrapper.emitted('change')).toContainEqual([2])
  })

  it('deletes current workspace when confirmation is accepted', async () => {
    const workspaceStore = useWorkspaceStore()
    workspaceStore.addWorkspace([])

    const wrapper = mountSwitcher()
    await settleUi()

    await wrapper.find('.go-to').trigger('click')
    await wrapper.find('.delete-current').trigger('click')
    await settleUi()

    expect(window.confirm).toHaveBeenCalledTimes(1)
    expect(workspaceStore.workspaces).toHaveLength(1)
  })
})
