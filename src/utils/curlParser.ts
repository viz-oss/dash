// Type returned by parser – for native fetch()
export interface ParsedFetch {
  url: string;
  options: RequestInit;
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
function interpolateVariables(
  text: string,
  variables: Record<string, string>
): string {
  // Helper function: if the variable exists in the dictionary, replace it.
  // Otherwise, leave the original text.
  const replacer = (match: string, key: string) => variables[key] ?? match;

  let interpolated = text;

  // 1. Format: {{NAME}}
  interpolated = interpolated.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, replacer);
  
  // 2. Format: ${NAME}
  interpolated = interpolated.replace(/\$\{([a-zA-Z0-9_]+)\}/g, replacer);
  
  // 3. Format: $NAME
  interpolated = interpolated.replace(/\$([a-zA-Z0-9_]+)/g, replacer);
  
  // 4. Format: %NAME%
  interpolated = interpolated.replace(/%([a-zA-Z0-9_]+)%/g, replacer);
  
  // 5. Format: :NAME
  // We use "Negative Lookbehind" (?<!...) to avoid matching "http:" or "https:"
  interpolated = interpolated.replace(/(?<!https?|ftp):([a-zA-Z0-9_]+)\b/g, replacer);

  return interpolated;
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
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  const tokens: string[] = [];
  let match;

  while ((match = regex.exec(command)) !== null) {
    tokens.push(match[1] ?? match[2] ?? match[0]);
  }

  return tokens;
}

/**
 * Main function that parses a curl command into parameters for fetch().
 */
export function parseCurlToFetch(
  curlCommand: string,
  variables: Record<string, string> = {}
): ParsedFetch {
  const interpolatedCommand = interpolateVariables(curlCommand, variables);

  const tokens = tokenize(interpolatedCommand);

  let url = '';
  const options: RequestInit = {
    method: 'GET', // Default GET method
    headers: {} as Record<string, string>,
  };

  // Iterate through the tokens to extract URL, method, headers, and body
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === 'curl') continue;

    // Capturing the HTTP method
    if (token === '-X' || token === '--request') {
      options.method = tokens[++i].toUpperCase();
      continue;
    }

    // Capturing headers
    if (token === '-H' || token === '--header') {
      const headerStr = tokens[++i];
      const colonIndex = headerStr.indexOf(':');
      if (colonIndex > -1) {
        const key = headerStr.slice(0, colonIndex).trim();
        const value = headerStr.slice(colonIndex + 1).trim();
        (options.headers as Record<string, string>)[key] = value;
      }
      continue;
    }

    // Capturing the request body (data/body)
    if (token === '-d' || token === '--data' || token === '--data-raw') {
      options.body = tokens[++i];
      // If the user used -d but did not specify the method, curl defaults to POST
      if (options.method === 'GET') {
        options.method = 'POST';
      }
      continue;
    }

    // If this is not a flag (does not start with '-') and we don't have a URL yet, treat it as the URL
    if (!token.startsWith('-') && !url) {
      url = token;
    }
  }

  return { url, options };
}