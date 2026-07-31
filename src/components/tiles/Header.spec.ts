import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useEditmodeStore } from '@/stores/editmode'
import Header from './Header.vue'

const VueBottomSheetStub = defineComponent({
  setup(_props, { slots, expose }) {
    expose({
      open: () => {},
      close: () => {},
    })

    return () => h('div', slots.default?.())
  },
})

describe('Header', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountHeader(props: Record<string, unknown> = {}) {
    return mount(Header, {
      props: {
        id: 'header-1',
        title: 'Main title',
        subtitle: 'Sub title',
        ...props,
      },
      global: {
        stubs: {
          VueBottomSheet: VueBottomSheetStub,
          HeaderSettings: true,
        },
      },
    })
  }

  it('renders title and subtitle from props', () => {
    const wrapper = mountHeader()

    expect(wrapper.find('h1').text()).toBe('Main title')
    expect(wrapper.find('h2').text()).toBe('Sub title')
  })

  it('emits remove when close icon is clicked in edit mode', async () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountHeader()

    expect(wrapper.find('.close').exists()).toBe(true)

    await wrapper.find('.close').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[]])
  })

  it('hides close icon in thumb mode even when edit mode is active', () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountHeader({ thumb: true })

    expect(wrapper.classes()).toContain('thumb')
    expect(wrapper.find('.close').exists()).toBe(false)
  })
})
