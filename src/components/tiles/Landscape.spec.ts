import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useEditmodeStore } from '@/stores/editmode'
import Landscape from './Landscape.vue'

const VueBottomSheetStub = defineComponent({
  setup(_props, { slots, expose }) {
    expose({
      open: () => {},
      close: () => {},
    })

    return () => h('div', slots.default?.())
  },
})

describe('Landscape', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountLandscape(props: Record<string, unknown> = {}) {
    return mount(Landscape, {
      props: {
        id: 'landscape-1',
        theme: 'desert',
        ...props,
      },
      global: {
        stubs: {
          VueBottomSheet: VueBottomSheetStub,
          LandscapeSettings: true,
        },
      },
    })
  }

  it('renders image source based on theme prop', () => {
    const wrapper = mountLandscape({ theme: 'mountains' })

    const image = wrapper.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toContain('/public/_landscape-mountains.png')
  })

  it('emits remove when close icon is clicked in edit mode', async () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountLandscape()

    expect(wrapper.find('.close').exists()).toBe(true)

    await wrapper.find('.close').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[]])
  })

  it('hides close icon in thumb mode even when edit mode is active', () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountLandscape({ thumb: true })

    expect(wrapper.classes()).toContain('thumb')
    expect(wrapper.find('.close').exists()).toBe(false)
  })
})
