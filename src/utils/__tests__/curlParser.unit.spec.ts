import { describe, expect, it } from 'vitest'
import { parseCurlToFetch } from '@/utils/curlParser'

describe('curlParser unit parsing', () => {
  it('uses GET by default and extracts plain URL', () => {
    const { url, options } = parseCurlToFetch('curl https://api.example.com/items')

    expect(url).toBe('https://api.example.com/items')
    expect(options.method).toBe('GET')
    expect(options.body).toBeUndefined()
    expect(options.headers).toEqual({})
  })

  it('extracts method, headers and body with quoted values', () => {
    const command = `curl -X POST "https://api.example.com/users" -H "Content-Type: application/json" -H "Authorization: Bearer abc" -d '{"name":"Jane Doe"}'`

    const { url, options } = parseCurlToFetch(command)

    expect(url).toBe('https://api.example.com/users')
    expect(options.method).toBe('POST')
    expect(options.body).toBe('{"name":"Jane Doe"}')
    expect(options.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer abc',
    })
  })

  it('switches to POST when data is present and no explicit method is set', () => {
    const { options } = parseCurlToFetch("curl https://api.example.com/login --data-raw '{\"email\":\"john@example.com\"}'")

    expect(options.method).toBe('POST')
    expect(options.body).toBe('{"email":"john@example.com"}')
  })

  it('interpolates variables in URL and headers', () => {
    const command = 'curl https://postman-echo.com/:endpoint -H "X-App: %appName%" -H "Authorization: Bearer ${token}"'

    const { url, options } = parseCurlToFetch(command, {
      endpoint: 'get',
      appName: 'Dash',
      token: 'secret',
    })

    expect(url).toBe('https://postman-echo.com/get')
    expect(options.headers).toEqual({
      'X-App': 'Dash',
      Authorization: 'Bearer secret',
    })
  })

  it('ignores malformed headers without colon separator', () => {
    const { options } = parseCurlToFetch('curl https://example.com -H "MalformedHeader" -H "Accept: application/json"')

    expect(options.headers).toEqual({ Accept: 'application/json' })
  })
})
