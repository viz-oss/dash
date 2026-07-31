import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from './Icon.vue'

describe('Icon', () => {
  it('renders default icon class', () => {
    const wrapper = mount(Icon)

    const iconElement = wrapper.find('i')
    expect(iconElement.exists()).toBe(true)
    expect(iconElement.classes()).toContain('fa-regular')
    expect(iconElement.classes()).toContain('fa-face-smile')
    expect(iconElement.classes()).toContain('user-icon')
  })

  it('renders provided icon class', () => {
    const wrapper = mount(Icon, {
      props: {
        icon: 'fa-solid fa-user',
      },
    })

    const iconElement = wrapper.find('i')
    expect(iconElement.classes()).toContain('fa-solid')
    expect(iconElement.classes()).toContain('fa-user')
  })

  it('renders text only when text prop is provided', () => {
    const noTextWrapper = mount(Icon)
    expect(noTextWrapper.find('.text').exists()).toBe(false)

    const textWrapper = mount(Icon, {
      props: {
        text: 'Agent',
      },
    })

    expect(textWrapper.find('.text').text()).toBe('Agent')
  })
})
