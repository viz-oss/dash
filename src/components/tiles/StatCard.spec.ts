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

import StatCard from './StatCard.vue'

const VueBottomSheetStub = defineComponent({
  setup(_props, { slots, expose }) {
    expose({
      open: () => {},
      close: () => {},
    })

    return () => h('div', slots.default?.())
  },
})

describe('StatCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    requestData.value = {
      stats: {
        users: 1248,
      },
      delta: {
        value: '12%',
      },
    }
    requestError.value = null
    requestFetching.value = false
  })

  function mountStatCard(props: Record<string, unknown> = {}) {
    return mount(StatCard, {
      props: {
        id: 'stat-1',
        url: 'curl https://example.com',
        ...props,
      },
      global: {
        stubs: {
          VueBottomSheet: VueBottomSheetStub,
          StatCardSettings: true,
        },
      },
    })
  }

  it('renders parsed title and value from request data', () => {
    const wrapper = mountStatCard({
      title: 'Users ${stats.users}',
      value: '${stats.users}',
    })

    expect(wrapper.find('.metric-title').text()).toBe('Users 1248')
    expect(wrapper.find('.metric-value').text()).toBe('1248')
  })

  it('applies tone class and renders down trend arrow when isUp is false', () => {
    const wrapper = mountStatCard({
      tone: 'x2',
      isUp: false,
      changeValue: '7%',
      periodText: 'vs yesterday',
    })

    expect(wrapper.classes()).toContain('tone-x2')
    expect(wrapper.find('.trend-icon i').classes()).toContain('fa-arrow-down')
    expect(wrapper.text()).toContain('7%')
    expect(wrapper.text()).toContain('vs yesterday')
  })

  it('emits remove when close button is clicked in edit mode', async () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountStatCard()
    const closeButton = wrapper.find('.close')

    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger('click')

    expect(wrapper.emitted('remove')).toEqual([[]])
  })

  it('does not show close button when thumb is enabled', () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountStatCard({ thumb: true })

    expect(wrapper.classes()).toContain('thumb')
    expect(wrapper.find('.close').exists()).toBe(false)
  })
})
