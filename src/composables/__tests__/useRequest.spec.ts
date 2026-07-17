import { afterEach, describe, expect, it, vi } from 'vitest'
import { useRequest } from '../useRequest'

async function waitForFetchToSettle(): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await Promise.resolve()
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

describe('useRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('parses JSON responses from the content type header', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ total: 42 }), {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }),
      ),
    )

    const { data, error, isFetching } = useRequest<{ total: number }>('https://example.com')

    await waitForFetchToSettle()

    expect(data.value).toEqual({ total: 42 })
    expect(error.value).toBeNull()
    expect(isFetching.value).toBe(false)
  })

  it('parses text responses when the content type is text/*', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('plain text body', {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
      ),
    )

    const { data, error, isFetching } = useRequest<string>('https://example.com')

    await waitForFetchToSettle()

    expect(data.value).toBe('plain text body')
    expect(error.value).toBeNull()
    expect(isFetching.value).toBe(false)
  })

  it('returns null for responses without a body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 204,
        }),
      ),
    )

    const { data, error, isFetching } = useRequest<null>('https://example.com')

    await waitForFetchToSettle()

    expect(data.value).toBeNull()
    expect(error.value).toBeNull()
    expect(isFetching.value).toBe(false)
  })

  it('stores parsed error payload for non-ok HTTP responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'missing' }), {
          status: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }),
      ),
    )

    const { data, error, isFetching } = useRequest<{ message: string }>('https://example.com')

    await waitForFetchToSettle()

    expect(data.value).toBeNull()
    expect(error.value).toMatchObject({
      message: 'Request failed with status 404 Not Found',
      status: 404,
      statusText: 'Not Found',
      data: { message: 'missing' },
    })
    expect(isFetching.value).toBe(false)
  })
})