import { beforeEach, describe, expect, it } from 'vitest'
import { disableBrowserZoom } from '@/utils/screen'

describe('disableBrowserZoom', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    document.documentElement.style.touchAction = ''
    document.body.style.touchAction = ''
  })

  it('creates viewport meta tag when missing and sets strict content', () => {
    disableBrowserZoom()

    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null
    expect(viewport).not.toBeNull()
    expect(viewport?.getAttribute('content')).toBe(
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
    )
  })

  it('updates existing viewport meta tag instead of adding another', () => {
    const existing = document.createElement('meta')
    existing.setAttribute('name', 'viewport')
    existing.setAttribute('content', 'width=device-width')
    document.head.appendChild(existing)

    disableBrowserZoom()

    const viewports = document.querySelectorAll('meta[name="viewport"]')
    expect(viewports).toHaveLength(1)
    expect((viewports[0] as HTMLMetaElement).getAttribute('content')).toContain('maximum-scale=1')
  })

  it('sets touchAction on html and body', () => {
    disableBrowserZoom()

    expect(document.documentElement.style.touchAction).toBe('manipulation')
    expect(document.body.style.touchAction).toBe('manipulation')
  })

  it('prevents ctrl+wheel zoom', () => {
    disableBrowserZoom()

    const wheel = new WheelEvent('wheel', { ctrlKey: true, cancelable: true })
    document.dispatchEvent(wheel)

    expect(wheel.defaultPrevented).toBe(true)
  })

  it('prevents keyboard zoom shortcuts', () => {
    disableBrowserZoom()

    const keydown = new KeyboardEvent('keydown', {
      ctrlKey: true,
      key: '+',
      cancelable: true,
    })

    document.dispatchEvent(keydown)

    expect(keydown.defaultPrevented).toBe(true)
  })

  it('prevents pinch zoom gestures on multi-touch events', () => {
    disableBrowserZoom()

    const touchstart = new Event('touchstart', { cancelable: true }) as Event & {
      touches: Array<{ identifier: number }>
    }

    Object.defineProperty(touchstart, 'touches', {
      value: [{ identifier: 1 }, { identifier: 2 }],
      configurable: true,
    })

    document.dispatchEvent(touchstart)

    expect(touchstart.defaultPrevented).toBe(true)
  })

  it('prevents rapid double-tap zoom on touchend', () => {
    disableBrowserZoom()

    const firstTouchEnd = new Event('touchend', { cancelable: true })
    const secondTouchEnd = new Event('touchend', { cancelable: true })

    document.dispatchEvent(firstTouchEnd)
    document.dispatchEvent(secondTouchEnd)

    expect(firstTouchEnd.defaultPrevented).toBe(false)
    expect(secondTouchEnd.defaultPrevented).toBe(true)
  })

  it('registers safari gesture handlers that prevent default', () => {
    disableBrowserZoom()

    const gesture = new Event('gesturestart', { cancelable: true })
    document.dispatchEvent(gesture)

    expect(gesture.defaultPrevented).toBe(true)
  })
})
