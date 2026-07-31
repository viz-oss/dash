import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IconPicker from './IconPicker.vue'
import Icon from './Icon.vue'

describe('IconPicker', () => {
  it('renders one Icon component per icon option', () => {
    const icons = ['fa-solid fa-user', 'fa-solid fa-gear', 'fa-regular fa-star']

    const wrapper = mount(IconPicker, {
      props: {
        icons,
        modelValue: '',
      },
    })

    expect(wrapper.findAllComponents(Icon)).toHaveLength(3)
  })

  it('emits update:modelValue when an option is clicked', async () => {
    const icons = ['fa-solid fa-user', 'fa-solid fa-gear']

    const wrapper = mount(IconPicker, {
      props: {
        icons,
        modelValue: '',
      },
    })

    const iconOptions = wrapper.findAll('.icon-option .icon')
    await iconOptions[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['fa-solid fa-gear']])
  })

  it('adds selected class to the active icon', () => {
    const icons = ['fa-solid fa-user', 'fa-solid fa-gear']

    const wrapper = mount(IconPicker, {
      props: {
        icons,
        modelValue: 'fa-solid fa-gear',
      },
    })

    const iconComponents = wrapper.findAllComponents(Icon)
    expect(iconComponents[0]?.classes()).not.toContain('icon--selected')
    expect(iconComponents[1]?.classes()).toContain('icon--selected')
  })

  it('renders empty state without options', () => {
    const wrapper = mount(IconPicker, {
      props: {
        icons: [],
        modelValue: '',
      },
    })

    expect(wrapper.findAllComponents(Icon)).toHaveLength(0)
    expect(wrapper.findAll('.icon-option')).toHaveLength(0)
  })
})
