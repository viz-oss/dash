import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Dropdown from './Dropdown.vue'

describe('Dropdown', () => {
  it('renders the dropdown icon container', () => {
    const wrapper = mount(Dropdown)

    expect(wrapper.find('.icon').exists()).toBe(true)
  })

  it('renders edit icon class', () => {
    const wrapper = mount(Dropdown)

    const iconElement = wrapper.find('i')
    expect(iconElement.exists()).toBe(true)
    expect(iconElement.classes()).toContain('fa-regular')
    expect(iconElement.classes()).toContain('fa-pen-to-square')
  })
})
