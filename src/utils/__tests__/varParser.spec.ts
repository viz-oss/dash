import { describe, it, expect } from 'vitest'
import { parseVariables } from '../varParser'

describe('parseVariables', () => {
  const variables = {
    USER: 'testuser',
    HOST: 'example.com',
    PORT: '8080',
    PATH: '/api/v1',
    SECRET_KEY: 'supersecret',
  }

  // Test case 1: Basic replacement for {{NAME}} format
  it('should replace variables in {{NAME}} format', () => {
    const text = 'curl -H "User-Agent: {{USER}}" http://{{host}}:{{PORT}}/path'
    const expected = 'curl -H "User-Agent: testuser" http://example.com:8080/path'
    expect(parseVariables(text, variables)).toBe(expected)
  })

  // Test case 2: Basic replacement for ${NAME} format
  it('should replace variables in ${NAME} format', () => {
    const text = 'curl -H "Authorization: Bearer ${SECRET_KEY}" http://${host}'
    const expected = 'curl -H "Authorization: Bearer supersecret" http://example.com'
    expect(parseVariables(text, variables)).toBe(expected)
  })

  // Test case 3: Basic replacement for $NAME format
  it('should replace variables in $name format', () => {
    const text = 'curl -v "http://$HOST$PATH"'
    const expected = 'curl -v "http://example.com/api/v1"'
    expect(parseVariables(text, variables)).toBe(expected)
  })

  // Test case 4: Basic replacement for %NAME% format
  it('should replace variables in %name% format', () => {
    const text = 'curl --data "key=%SECRET_KEY%" http://%HOST%'
    const expected = 'curl --data "key=supersecret" http://example.com'
    expect(parseVariables(text, variables)).toBe(expected)
  })

  // Test case 5: Basic replacement for :NAME format (non-protocol)
  it('should replace variables in :NAME format when not part of a protocol', () => {
    const text = 'curl -X GET http://${HOST}:${port}/resource/:USER'
    const expected = 'curl -X GET http://example.com:8080/resource/testuser'
    expect(parseVariables(text, variables)).toBe(expected)
  })

  // Test case 6: Handling mixed formats and multiple replacements
  it('should correctly replace variables across different formats', () => {
    const text = 'curl -X GET http://${HOST}:${port}/path/${USER}/?key=%SECRET_KEY%'
    const expected = 'curl -X GET http://example.com:8080/path/testuser/?key=supersecret'
    expect(parseVariables(text, variables)).toBe(expected)
  })

  // Test case 7: Handling unreplaced variables (should remain unchanged)
  it('should leave variables that are not defined in the dictionary untouched', () => {
    const text = 'curl http://unknown.com/path/$UNDEFINED_VAR?q={{missing}}'
    const expected = 'curl http://unknown.com/path/$UNDEFINED_VAR?q={{missing}}'
    expect(parseVariables(text, variables)).toBe(expected)
  })

  // Test case 8: Handling protocol-prefixed colons (should NOT replace)
  it('should not replace variables when preceded by http: or https:', () => {
    // Test case where :NAME follows a protocol and shouldn't be replaced if it looks like part of the URL structure.
    const text = 'curl https://${HOST}:/path/to/:USER'
    // The variable $HOST is replaced, but the colon after http:// should not trigger replacement for :USER if it's considered a path segment following a protocol-like structure.
    // Based on varParser logic: only replaces if NOT preceded by https?|ftp:
    const expected = 'curl https://example.com:/path/to/testuser'
    expect(parseVariables(text, variables)).toBe(expected)

    // URL port separators must stay intact.
    const text2 = 'curl http://example.com:80/path'
    expect(parseVariables(text2, variables)).toBe(text2)
  })

  // Test case 9: URL host port should not be treated as :NAME, unless forced with double-colon syntax
  it('should preserve host ports and allow explicit ::NAME variable syntax', () => {
    const vars = {
      8000: 'PORT_VALUE',
    }

    expect(parseVariables('curl http://127.0.0.1:8000/', vars)).toBe('curl http://127.0.0.1:8000/')
    expect(parseVariables('curl http://127.0.0.1::8000/', vars)).toBe(
      'curl http://127.0.0.1:PORT_VALUE/',
    )
  })

  // Test case 10: Empty input string
  it('should return an empty string when given an empty input', () => {
    expect(parseVariables('', variables)).toBe('')
  })

  // Test case 11: Complex structure resolution (nested objects and arrays)
  it('should resolve arbitrarily complex structures like {{foo[0].bar[1].x}}', () => {
    const complexVars = {
      foo: [
        {
          bar: [null, { x: 'resolved_value' }],
        },
      ],
      user: {
        address: {
          city: 'Warsaw',
          zip: '00-001',
        },
      },
      pts: [{ value: [10, 20, 30] }],
    }

    expect(parseVariables('Value is {{foo[0].bar[1].x}}', complexVars)).toBe(
      'Value is resolved_value',
    )
    expect(parseVariables('City: ${user.address.city}', complexVars)).toBe('City: Warsaw')
    expect(parseVariables('Point: %pts[0].value[2]%', complexVars)).toBe('Point: 30')
    expect(parseVariables('Path: /api/:foo[0].bar[1].x/details', complexVars)).toBe(
      'Path: /api/resolved_value/details',
    )
    expect(parseVariables('Direct: $user.address.zip', complexVars)).toBe('Direct: 00-001')
  })

  // Test case 12: Case-insensitive property matching in nested objects
  it('should perform case-insensitive property lookups in complex structures', () => {
    const complexVars = {
      Foo: [
        {
          Bar: {
            X: 'case_insensitive_val',
          },
        },
      ],
    }

    expect(parseVariables('Result: {{foo[0].bar.x}}', complexVars)).toBe(
      'Result: case_insensitive_val',
    )
    expect(parseVariables('Result: {{FOO[0].BAR.X}}', complexVars)).toBe(
      'Result: case_insensitive_val',
    )
  })

  // Test case 13: Quoted bracket keys and flat keys containing dots/brackets
  it('should resolve quoted bracket keys and direct flat path keys', () => {
    const complexVars = {
      data: {
        'my-key': [{ 'nested.property': 999 }],
      },
      'flat[0].key': 'flat_result',
    }

    expect(parseVariables('Result: {{data["my-key"][0]["nested.property"]}}', complexVars)).toBe(
      'Result: 999',
    )
    expect(parseVariables('Result: {{flat[0].key}}', complexVars)).toBe('Result: flat_result')
  })

  // Test case 14: Fallback prefix resolution for un-delimited formats ($NAME and :NAME)
  it('should fallback to resolving prefixes if the full path is not found for $NAME and :NAME', () => {
    const vars = {
      user: {
        name: 'alice',
      },
      host: 'localhost',
    }

    // Here, $user.name resolves to 'alice', and .com is left untouched because user.name.com does not exist
    expect(parseVariables('http://$user.name.com', vars)).toBe('http://alice.com')
    expect(parseVariables('http://$host.org/resource/:user.name.json', vars)).toBe(
      'http://localhost.org/resource/alice.json',
    )
  })

  // Test case 15: Formatting object/array values to JSON
  it('should format resolved objects and arrays as JSON strings', () => {
    const vars = {
      pts: [{ value: [1, 2, 3] }],
    }

    expect(parseVariables('Data: {{pts[0].value}}', vars)).toBe('Data: [1,2,3]')
    expect(parseVariables('Item: {{pts[0]}}', vars)).toBe('Item: {"value":[1,2,3]}')
  })
})
