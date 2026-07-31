import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Chat from './Chat.vue'

async function settleChat(): Promise<void> {
  for (let index = 0; index < 4; index += 1) {
    await Promise.resolve()
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

describe('Chat', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  function mountChat() {
    return mount(Chat, {
      props: {
        url: 'curl https://example.com/chat -X POST -H "Content-Type: application/json" -d "{\"prompt\":\"${PROMPT}\",\"thread\":\"${THREAD_ID}\"}"',
      },
    })
  }

  it('sends a message and renders bot response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'ok',
          payload: { text: 'Hello from bot' },
        }),
      }),
    )

    const wrapper = mountChat()
    const input = wrapper.find('input')

    await input.setValue('Hello')
    await input.trigger('keyup.enter')
    await settleChat()

    const messages = wrapper.findAll('.message-bubble')
    expect(messages.length).toBe(2)
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('Hello from bot')
  })

  it('renders JSON payload as table when response text is a flat object', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'ok',
          payload: { text: '{"users":42,"status":"ok"}' },
        }),
      }),
    )

    const wrapper = mountChat()
    const input = wrapper.find('input')

    await input.setValue('Show stats')
    await input.trigger('keyup.enter')
    await settleChat()

    expect(wrapper.find('.json-table').exists()).toBe(true)
    const headers = wrapper.findAll('.json-table th').map((node) => node.text())
    expect(headers).toEqual(['Key', 'Value'])
    expect(wrapper.text()).toContain('users')
    expect(wrapper.text()).toContain('42')
  })

  it('opens external link from bot message', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'ok',
          payload: { text: 'Read this https://example.com/docs' },
        }),
      }),
    )

    const wrapper = mountChat()
    const input = wrapper.find('input')

    await input.setValue('Link please')
    await input.trigger('keyup.enter')
    await settleChat()

    const linkButton = wrapper.find('button.message-link-button[title="https://example.com/docs"]')
    expect(linkButton.exists()).toBe(true)

    await linkButton.trigger('click')

    expect(openSpy).toHaveBeenCalledWith('https://example.com/docs', '_blank', 'noopener,noreferrer')
  })

  it('renders processing status message while backend is generating response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'processing',
        }),
      }),
    )

    const wrapper = mountChat()
    const input = wrapper.find('input')

    await input.setValue('Generate report')
    await input.trigger('keyup.enter')
    await settleChat()

    expect(wrapper.text()).toContain('Odpowiedź w trakcie generowania...')
  })

  it('renders explicit backend error message for status error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'error',
          payload: { error: 'Rate limit exceeded' },
        }),
      }),
    )

    const wrapper = mountChat()
    const input = wrapper.find('input')

    await input.setValue('Run heavy task')
    await input.trigger('keyup.enter')
    await settleChat()

    expect(wrapper.text()).toContain('Błąd: Rate limit exceeded')
  })

  it('renders communication error when request fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')))

    const wrapper = mountChat()
    const input = wrapper.find('input')

    await input.setValue('Try again')
    await input.trigger('keyup.enter')
    await settleChat()

    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Błąd komunikacji: Network down')
  })

  it('sends command link target as a follow-up message when command button is clicked', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'ok',
          payload: { text: '[Run command](run diagnostics)' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'ok',
          payload: { text: 'Diagnostics completed' },
        }),
      })

    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mountChat()
    const input = wrapper.find('input')

    await input.setValue('Need help')
    await input.trigger('keyup.enter')
    await settleChat()

    const commandButton = wrapper.find('button.message-link-button[title="run diagnostics"]')
    expect(commandButton.exists()).toBe(true)

    await commandButton.trigger('click')
    await settleChat()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('run diagnostics')
    expect(wrapper.text()).toContain('Diagnostics completed')
  })
})
