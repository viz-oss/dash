import { describe, it, expect } from 'vitest'
import { parseCurlToFetch } from '@/utils/curlParser'

describe('curlParser - True Integration Test (httpbin)', () => {
  it('should send GET to postman-echo and receive back processed variables', async () => {
    // 1. Arrange
    const command = `
      curl -X GET "https://postman-echo.com/:endpoint" \
      -H "Authorization: Bearer \${token}" \
      -H "X-Test-App: %appName%"
    `

    const variables = {
      endpoint: 'get',
      token: 'super_secret_123',
      appName: 'VueApp',
    }

    // 2. Act - Parsing
    const { url, options } = parseCurlToFetch(command, variables)

    // 3. Act - Sending the real network request
    const response = await fetch(url, options)
    if (response.status !== 200) {
      const html = await response.text()
      throw new Error(`Request failed with status ${response.status}:\n${html}`)
    }

    // 4. Act - Parsing the response body
    const data = await response.json()
    console.log(data)

    // 4. Assert - httpbin returns e.g. URL in the object, headers, and data (body)
    expect(response.status).toBe(200)

    // Assert - check if URL correctly substituted the {{endpoint}} variable
    expect(data.url).toBe('https://postman-echo.com/get')

    // Assert - headers
    expect(data.headers['authorization']).toBe('Bearer super_secret_123')
    expect(data.headers['x-test-app']).toBe('VueApp')
  })
})
