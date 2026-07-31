import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useEditmodeStore } from '@/stores/editmode'
import TrendChart from './TrendChart.vue'

const VueBottomSheetStub = defineComponent({
  setup(_props, { slots, expose }) {
    expose({
      open: () => {},
      close: () => {},
    })

    return () => h('div', slots.default?.())
  },
})

describe('TrendChart', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountTrendChart(props: Record<string, unknown> = {}) {
    return mount(TrendChart, {
      props: {
        id: 'trend-1',
        title: 'Weekly overview',
        ...props,
      },
      global: {
        stubs: {
          VueBottomSheet: VueBottomSheetStub,
          TrendChartSettings: true,
        },
      },
    })
  }

  it('renders title and chart svg structure', () => {
    const wrapper = mountTrendChart()

    expect(wrapper.find('.title').text()).toBe('Weekly overview')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').exists()).toBe(true)
  })

  it('renders seven day labels', () => {
    const wrapper = mountTrendChart()

    expect(wrapper.findAll('.day-name')).toHaveLength(7)
  })

  it('emits remove when close button is clicked in edit mode', async () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountTrendChart()

    expect(wrapper.find('.close').exists()).toBe(true)

    await wrapper.find('.close').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[]])
  })

  it('hides close button in thumb mode even when edit mode is enabled', () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountTrendChart({ thumb: true })

    expect(wrapper.classes()).toContain('thumb')
    expect(wrapper.find('.close').exists()).toBe(false)
  })
})
