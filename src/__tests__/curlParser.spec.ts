import { describe, it, expect } from 'vitest'
import { parseCurlToFetch } from '@/utils/curlParser'

describe('curlParser - True Integration Test (httpbin)', () => {
  it('should send POST to httpbin and receive back processed variables', async () => {
    // 1. Arrange
    const command = `
      curl -X POST "https://httpbin.org/anything/{{endpoint}}" 
      -H "Authorization: Bearer \${token}" 
      -H "X-Test-App: %appName%"
      -d '{"message": "Hello from parser!"}'
    `
    
    const variables = { 
      endpoint: 'test-api',
      token: 'super_secret_123',
      appName: 'VueApp'
    }

    // 2. Act - Parsing
    const { url, options } = parseCurlToFetch(command, variables)

    // 3. Act - Sending the real network request
    const response = await fetch(url, options)
    const data = await response.json()

    // 4. Assert - httpbin returns e.g. URL in the object, headers, and data (body)
    expect(response.status).toBe(200)
    
    // Assert - check if URL correctly substituted the {{endpoint}} variable
    expect(data.url).toBe('https://httpbin.org/anything/test-api')
    
    // Assert - httpbin converts headers to Camel-Case/Capitalized, check if our variables arrived
    expect(data.headers['Authorization']).toBe('Bearer super_secret_123')
    expect(data.headers['X-Test-App']).toBe('VueApp')
    
    // Assert - check if the request body (-d) arrived intact
    expect(data.data).toBe('{"message": "Hello from parser!"}')
  })
})