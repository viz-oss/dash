import { parseVariables } from './varParser'

// Type returned by parser – for native fetch()
export interface ParsedFetch {
  url: string
  options: RequestInit
}

/**
 * Tokenizes a curl command string into an array of arguments, respecting quoted strings.
 * For example, the command:
 * curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://example.com
 * would be tokenized into:
 * ["curl", "-X", "POST", "-H", "Content-Type: application/json", "-d", '{"key":"value"}', "https://example.com"]
 *
 * @param command The curl command string to tokenize.
 * @returns An array of tokens/arguments.
 */
function tokenize(command: string): string[] {
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g
  const tokens: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(command)) !== null) {
    tokens.push(match[1] ?? match[2] ?? match[0])
  }

  return tokens
}

/**
 * Clean curl-like strings by removing line continuations and extra whitespace.
 * @param command The curl command string to clean.
 * @returns A cleaned-up command string.
 */
function cleanCommand(command: string): string {
  return command.replace(/\\\n/g, '').replaceAll('\\', '').replace(/\s+/g, ' ').trim()
}

/**
 * Main function that parses a curl command into parameters for fetch().
 */
export function parseCurlToFetch(
  curlCommand: string,
  variables: Record<string, string> = {},
): ParsedFetch {
  const interpolatedCommand: string = parseVariables(cleanCommand(curlCommand), variables)

  const tokens: string[] = tokenize(interpolatedCommand)

  let url: string = ''
  const options: RequestInit = {
    method: 'GET', // Default GET method
    headers: {} as Record<string, string>,
  }

  // Iterate through the tokens to extract URL, method, headers, and body
  for (let i = 0; i < tokens.length; i++) {
    const token: string | undefined = tokens[i]

    if (token === 'curl') continue

    // Capturing the HTTP method
    if (token === '-X' || token === '--request') {
      const method = tokens[++i]
      if (method) {
        options.method = method.toUpperCase()
      }
      continue
    }

    // Capturing headers
    if (token === '-H' || token === '--header') {
      const headerStr: string | undefined = tokens[++i]
      if (headerStr) {
        const colonIndex: number = headerStr.indexOf(':')
        if (colonIndex > -1) {
          const key: string = headerStr.slice(0, colonIndex).trim()
          const value: string = headerStr.slice(colonIndex + 1).trim()
          const headers = options.headers as Record<string, string>
          headers[key] = value
        }
      }
      continue
    }

    // Capturing the request body (data/body)
    if (token === '-d' || token === '--data' || token === '--data-raw') {
      options.body = tokens[++i]
      // If the user used -d but did not specify the method, curl defaults to POST
      if (options.method === 'GET') {
        options.method = 'POST'
      }
      continue
    }

    // If this is not a flag (does not start with '-') and we don't have a URL yet, treat it as the URL
    if (token && !token.startsWith('-') && !url) {
      url = token
    }
  }

  return { url, options }
}
