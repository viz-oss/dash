import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useEditmodeStore } from '@/stores/editmode'

const requestData = ref<Record<string, unknown> | null>(null)
const requestError = ref<unknown>(null)
const requestFetching = ref(false)

vi.mock('@/composables/useRequest', () => ({
  useRequest: () => ({
    data: requestData,
    error: requestError,
    isFetching: requestFetching,
  }),
}))

import RingChart from './RingChart.vue'

const VueBottomSheetStub = defineComponent({
  setup(_props, { slots, expose }) {
    expose({
      open: () => {},
      close: () => {},
    })

    return () => h('div', slots.default?.())
  },
})

const ApexchartStub = defineComponent({
  props: {
    series: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'apexchart-stub',
        'data-series': JSON.stringify(props.series),
      })
  },
})

describe('RingChart', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    requestData.value = {
      metrics: {
        max: 100,
        active: 45,
        idle: 15,
      },
      labels: {
        one: 'Active',
        two: 'Idle',
      },
    }
    requestError.value = null
    requestFetching.value = false
  })

  function mountRingChart(props: Record<string, unknown> = {}) {
    return mount(RingChart, {
      props: {
        id: 'ring-1',
        url: 'curl https://example.com',
        ...props,
      },
      global: {
        stubs: {
          VueBottomSheet: VueBottomSheetStub,
          RingChartSettings: true,
          apexchart: ApexchartStub,
        },
      },
    })
  }

  it('renders parsed title, labels and values from request data', () => {
    const wrapper = mountRingChart({
      title: 'Capacity ${metrics.max}',
      max: '${metrics.max}',
      name1: '${labels.one}',
      value1: '${metrics.active}',
      name2: '${labels.two}',
      value2: '${metrics.idle}',
    })

    expect(wrapper.find('.title').text()).toBe('Capacity 100')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('45')
    expect(wrapper.text()).toContain('Idle')
    expect(wrapper.text()).toContain('15')
  })

  it('normalizes and clamps chart series values to 0-100 range', () => {
    requestData.value = {
      metrics: {
        max: 100,
        active: 120,
        idle: -10,
      },
    }

    const wrapper = mountRingChart({
      max: '${metrics.max}',
      value1: '${metrics.active}',
      value2: '${metrics.idle}',
    })

    const chart = wrapper.find('.apexchart-stub')
    expect(chart.exists()).toBe(true)
    expect(chart.attributes('data-series')).toBe('[100,0]')
  })

  it('emits remove when close button is clicked in edit mode', async () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountRingChart()

    await wrapper.find('.close').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[]])
  })
})
