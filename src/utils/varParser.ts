interface PathToken {
  key: string
  endIndex: number
}

/**
 * Tokenize a path like `foo[0].bar['my.key'][1].x` into segments with end positions in the original string.
 */
function tokenizePath(path: string): PathToken[] {
  const tokens: PathToken[] = []
  const regex = /(?:\[\s*(?:'([^']*)'|"([^"]*)"|([^\]]*?))\s*\])|(?:(?:\.?\s*)([a-z0-9_$-]+))/gi
  let match: RegExpExecArray | null
  let lastIdx = -1
  while ((match = regex.exec(path)) !== null) {
    if (regex.lastIndex === lastIdx) {
      regex.lastIndex++
      continue
    }
    lastIdx = regex.lastIndex
    const rawKey = match[1] ?? match[2] ?? match[3] ?? match[4]
    if (rawKey !== undefined) {
      const key = rawKey.trim()
      if (key.length > 0) {
        tokens.push({
          key,
          endIndex: regex.lastIndex,
        })
      }
    }
  }
  return tokens
}

/**
 * Helper to format resolved value to string.
 */
function formatValue(val: unknown): string {
  if (val === null) return 'null'
  if (val === undefined) return 'undefined'
  if (typeof val === 'object') {
    return JSON.stringify(val)
  }
  return String(val)
}

/**
 * Resolve a tokenized path of length `count` against `variables` and `variableMap`.
 */
function resolveTokens(
  path: string,
  tokens: PathToken[],
  count: number,
  variables: Record<string, unknown>,
  variableMap: Map<string, unknown>,
): { found: boolean; value: unknown } {
  if (count === 0 || count > tokens.length) {
    return { found: false, value: undefined }
  }

  // 1. Direct lookup for flat keys (e.g. "foo[0].bar" defined as a direct key in variables)
  const subPath = path.slice(0, tokens[count - 1]?.endIndex ?? 0).trim()
  if (variableMap.has(subPath.toLowerCase())) {
    return { found: true, value: variableMap.get(subPath.toLowerCase()) }
  }

  // 2. Traversal through nested structure
  let current: unknown = variables
  for (let i = 0; i < count; i++) {
    const token = tokens[i]?.key
    if (token === undefined) {
      return { found: false, value: undefined }
    }
    if (
      current === null ||
      current === undefined ||
      (typeof current !== 'object' && typeof current !== 'function')
    ) {
      return { found: false, value: undefined }
    }

    if (Array.isArray(current)) {
      const idx = Number(token)
      if (Number.isInteger(idx) && idx >= 0 && idx < current.length) {
        current = current[idx]
      } else if (token in current) {
        current = (current as unknown as Record<string, unknown>)[token]
      } else {
        return { found: false, value: undefined }
      }
    } else if (current instanceof Map) {
      if (current.has(token)) {
        current = current.get(token)
      } else {
        let foundInMap = false
        const lowerToken = token.toLowerCase()
        for (const [k, v] of current.entries()) {
          if (typeof k === 'string' && k.toLowerCase() === lowerToken) {
            current = v
            foundInMap = true
            break
          }
        }
        if (!foundInMap) {
          return { found: false, value: undefined }
        }
      }
    } else {
      // Plain Object
      if (token in current || Object.prototype.hasOwnProperty.call(current, token)) {
        current = (current as Record<string, unknown>)[token]
      } else {
        let foundInObj = false
        const lowerToken = token.toLowerCase()
        for (const k of Object.keys(current)) {
          if (k.toLowerCase() === lowerToken) {
            current = (current as Record<string, unknown>)[k]
            foundInObj = true
            break
          }
        }
        if (!foundInObj) {
          return { found: false, value: undefined }
        }
      }
    }
  }

  return { found: true, value: current }
}

/**
 * Recognize variable patterns in the curl command and replace them with values from the provided dictionary.
 * Supported formats:
 * 1. {{NAME}}
 * 2. ${NAME}
 * 3. $NAME
 * 4. %NAME%
 * 5. :NAME (but not in http: or https:)
 *
 * @param text The curl command string to process.
 * @param variables A dictionary of variable names and their corresponding values.
 * @returns The curl command with variables replaced by their values.
 */
export function parseVariables(text: string, variables: Record<string, unknown>): string {
  const variableMap = new Map<string, unknown>()
  if (variables && typeof variables === 'object') {
    for (const key in variables) {
      if (Object.prototype.hasOwnProperty.call(variables, key)) {
        variableMap.set(key.toLowerCase(), variables[key])
      }
    }
  }

  const exactReplacer = (match: string, path: string): string => {
    const tokens = tokenizePath(path)
    if (tokens.length === 0) return match
    const res = resolveTokens(path, tokens, tokens.length, variables, variableMap)
    if (res.found) {
      return formatValue(res.value)
    }
    return match
  }

  const prefixFallbackReplacer = (match: string, path: string): string => {
    const tokens = tokenizePath(path)
    if (tokens.length === 0) return match
    for (let c = tokens.length; c >= 1; c--) {
      const res = resolveTokens(path, tokens, c, variables, variableMap)
      if (res.found) {
        const endIdx = tokens[c - 1]?.endIndex ?? 0
        const leftover = path.slice(endIdx)
        return formatValue(res.value) + leftover
      }
    }
    return match
  }

  let interpolated: string = text

  const pathPattern =
    '[a-z0-9_]+(?:(?:\\.\\s*[a-z0-9_$-]+)|(?:\\[\\s*(?:\'[^\']*\'|"[^"]*"|[^\\]]+)\\s*\\]))*'

  // 1. Format: {{NAME}}
  interpolated = interpolated.replace(
    new RegExp(`\\{\\{\\s*(${pathPattern})\\s*\\}\\}`, 'gi'),
    (match, path) => exactReplacer(match, path),
  )

  // 2. Format: ${NAME}
  interpolated = interpolated.replace(
    new RegExp(`\\$\\s*\\{\\s*(${pathPattern})\\s*\\}`, 'gi'),
    (match, path) => exactReplacer(match, path),
  )

  // 3. Format: $NAME
  interpolated = interpolated.replace(new RegExp(`\\$(${pathPattern})`, 'gi'), (match, path) =>
    prefixFallbackReplacer(match, path),
  )

  // 4. Format: %NAME%
  interpolated = interpolated.replace(new RegExp(`%(${pathPattern})%`, 'gi'), (match, path) =>
    exactReplacer(match, path),
  )

  // 5. Format: :NAME (but not in http: or https:)
  interpolated = interpolated.replace(
    new RegExp(`(?<!https?|ftp):(${pathPattern})`, 'gi'),
    (match, path) => prefixFallbackReplacer(match, path),
  )

  return interpolated
}
