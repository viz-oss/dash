import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useOS } from '../useOS'

interface NavigatorDescriptor {
  userAgentData?: unknown
  platform?: string
}

function setNavigator(descriptor: NavigatorDescriptor): void {
  Object.defineProperty(window.navigator, 'userAgentData', {
    value: descriptor.userAgentData,
    configurable: true,
  })

  if (descriptor.platform !== undefined) {
    Object.defineProperty(window.navigator, 'platform', {
      value: descriptor.platform,
      configurable: true,
    })
  }
}

function mountUseOS(): ReturnType<typeof useOS> {
  let state!: ReturnType<typeof useOS>

  const Probe = defineComponent({
    setup() {
      state = useOS()
      return () => null
    },
  })

  mount(Probe)
  return state
}

describe('useOS', () => {
  afterEach(() => {
    Object.defineProperty(window.navigator, 'userAgentData', {
      value: undefined,
      configurable: true,
    })
  })

  it('detects macOS from navigator.userAgentData.platform', () => {
    setNavigator({
      userAgentData: {
        platform: 'macOS',
        mobile: false,
        brands: [],
      },
      platform: 'Unknown',
    })

    const { isMac, isWindows, osName } = mountUseOS()

    expect(isMac.value).toBe(true)
    expect(isWindows.value).toBe(false)
    expect(osName.value).toBe('macOS')
  })

  it('detects Windows from navigator.userAgentData.platform', () => {
    setNavigator({
      userAgentData: {
        platform: 'Windows',
        mobile: false,
        brands: [],
      },
      platform: 'MacIntel',
    })

    const { isMac, isWindows, osName } = mountUseOS()

    expect(isMac.value).toBe(false)
    expect(isWindows.value).toBe(true)
    expect(osName.value).toBe('Windows')
  })

  it('falls back to navigator.platform when userAgentData is unavailable', () => {
    setNavigator({
      userAgentData: undefined,
      platform: 'Linux armv8l',
    })

    const { isMac, isWindows, osName } = mountUseOS()

    expect(isMac.value).toBe(false)
    expect(isWindows.value).toBe(false)
    expect(osName.value).toBe('Linux')
  })

  it('returns unknown_os for unsupported short platform names', () => {
    setNavigator({
      userAgentData: undefined,
      platform: 'beos',
    })

    const { isMac, isWindows, osName } = mountUseOS()

    expect(isMac.value).toBe(false)
    expect(isWindows.value).toBe(false)
    expect(osName.value).toBe('unknown_os')
  })

  it('keeps detailed platform label for unsupported long names', () => {
    setNavigator({
      userAgentData: undefined,
      platform: 'some-custom-platform',
    })

    const { isMac, isWindows, osName } = mountUseOS()

    expect(isMac.value).toBe(false)
    expect(isWindows.value).toBe(false)
    expect(osName.value).toBe('some-custom-platform')
  })
})
