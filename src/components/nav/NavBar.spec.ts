import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useEditmodeStore } from '@/stores/editmode'
import NavBar from './NavBar.vue'

const IconStub = defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          class: ['icon-stub', attrs.class as string],
          'data-icon': props.icon,
          onClick: () => emit('click'),
        },
        props.icon,
      )
  },
})

describe('NavBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountNavBar(props: Record<string, unknown> = {}) {
    return mount(NavBar, {
      props: {
        total: 3,
        current: 1,
        swipeThreshold: 20,
        ...props,
      },
      global: {
        stubs: {
          Icon: IconStub,
        },
      },
    })
  }

  it('renders dots based on total and marks current dot as filled', () => {
    const wrapper = mountNavBar({ total: 4, current: 2 })

    const dots = wrapper.findAll('.dot')
    expect(dots).toHaveLength(4)
    expect(dots[2]?.classes()).toContain('fill')
  })

  it('emits go-to when clicking a dot', async () => {
    const wrapper = mountNavBar({ total: 3, current: 0 })

    const dots = wrapper.findAll('.dot')
    await dots[1]?.trigger('click')

    expect(wrapper.emitted('go-to')).toEqual([[1]])
  })

  it('shows edit controls and emits related actions in edit mode', async () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const wrapper = mountNavBar({ total: 3, current: 1 })

    const deleteButton = wrapper.find('[data-icon="fa-solid fa-trash"]')
    const leftButton = wrapper.find('[data-icon="fa-solid fa-chevron-left"]')
    const rightButton = wrapper.find('[data-icon="fa-solid fa-chevron-right"]')
    const addButton = wrapper.find('[data-icon="fa-solid fa-plus"]')

    expect(deleteButton.exists()).toBe(true)
    expect(leftButton.exists()).toBe(true)
    expect(rightButton.exists()).toBe(true)
    expect(addButton.exists()).toBe(true)

    await deleteButton.trigger('click')
    await leftButton.trigger('click')
    await rightButton.trigger('click')
    await addButton.trigger('click')

    expect(wrapper.emitted('delete-current')).toEqual([[]])
    expect(wrapper.emitted('move-left')).toEqual([[]])
    expect(wrapper.emitted('move-right')).toEqual([[]])
    expect(wrapper.emitted('add-next')).toEqual([[]])
  })

  it('marks arrow buttons as disabled on boundaries', () => {
    const editmodeStore = useEditmodeStore()
    editmodeStore.editmode = true

    const leftBoundary = mountNavBar({ total: 3, current: 0 })
    expect(leftBoundary.find('[data-icon="fa-solid fa-chevron-left"]').classes()).toContain('disabled')

    const rightBoundary = mountNavBar({ total: 3, current: 2 })
    expect(rightBoundary.find('[data-icon="fa-solid fa-chevron-right"]').classes()).toContain('disabled')
  })

  it('emits go-to on swipe left when threshold is exceeded', async () => {
    const wrapper = mountNavBar({ total: 5, current: 2, swipeThreshold: 20 })

    const navElement = wrapper.find('nav').element
    const pointerDown = new Event('pointerdown')
    const pointerUp = new Event('pointerup')
    Object.defineProperty(pointerDown, 'clientX', { value: 100 })
    Object.defineProperty(pointerUp, 'clientX', { value: 60 })

    navElement.dispatchEvent(pointerDown)
    navElement.dispatchEvent(pointerUp)

    expect(wrapper.emitted('go-to')).toEqual([[3]])
  })

  it('does not emit go-to on swipe if threshold is not reached', async () => {
    const wrapper = mountNavBar({ total: 5, current: 2, swipeThreshold: 20 })

    const navElement = wrapper.find('nav').element
    const pointerDown = new Event('pointerdown')
    const pointerUp = new Event('pointerup')
    Object.defineProperty(pointerDown, 'clientX', { value: 100 })
    Object.defineProperty(pointerUp, 'clientX', { value: 85 })

    navElement.dispatchEvent(pointerDown)
    navElement.dispatchEvent(pointerUp)

    expect(wrapper.emitted('go-to')).toBeUndefined()
  })
})
