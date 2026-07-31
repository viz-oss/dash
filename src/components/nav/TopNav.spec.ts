import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import TopNav from './TopNav.vue'
import { useEditmodeStore } from '@/stores/editmode'
import { useWorkspaceStore } from '@/stores/workspaceStore'

describe('TopNav', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountTopNav() {
    const VueBottomSheetStub = defineComponent({
      setup(_props, { slots, expose }) {
        expose({
          open: () => {},
          close: () => {},
        })

        return () => h('div', slots.default?.())
      },
    })

    return mount(TopNav, {
      props: {
        workspaceIndex: 0,
      },
      global: {
        stubs: {
          VueBottomSheet: VueBottomSheetStub,
          AddNewTileSheet: {
            template: '<div class="add-new-tile-sheet" @click="$emit(\'ok\', \'stat\')" />',
          },
          WorkspaceInfoSheet: {
            template: '<div class="workspace-info-sheet" />',
          },
        },
      },
    })
  }

  it('renders workspace info from store', () => {
    const workspaceStore = useWorkspaceStore()
    workspaceStore.updateWorkspaceInfo(0, {
      title: 'Analytics',
      description: 'Q3 dashboard',
      icon: 'fa-solid fa-chart-line',
    })

    const wrapper = mountTopNav()

    expect(wrapper.text()).toContain('Analytics')
    expect(wrapper.text()).toContain('Q3 dashboard')
  })

  it('toggles edit mode when edit icon is clicked', async () => {
    const editmodeStore = useEditmodeStore()
    const wrapper = mountTopNav()

    expect(editmodeStore.editmode).toBe(false)

    const editIcon = wrapper.find('.edit-icon')
    await editIcon.trigger('click')

    expect(editmodeStore.editmode).toBe(true)
  })

  it('shows add icon only in edit mode', async () => {
    const wrapper = mountTopNav()

    expect(wrapper.find('.add-icon').exists()).toBe(false)

    await wrapper.find('.edit-icon').trigger('click')
    expect(wrapper.find('.add-icon').exists()).toBe(true)
  })

  it('emits add event after AddNewTileSheet confirms selection', async () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountTopNav()

    await wrapper.find('.add-new-tile-sheet').trigger('click')

    expect(wrapper.emitted('add')).toEqual([['stat']])
  })
})
