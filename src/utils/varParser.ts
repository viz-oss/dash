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
export function parseVariables(text: string, variables: Record<string, any>): string {
  // Helper function: if the variable exists in the dictionary, replace it.
  // Otherwise, leave the original text.
  const variableMap = new Map<string, any>()
  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      variableMap.set(key.toLowerCase(), variables[key])
    }
  }

  const replacer: (match: string, key: string) => string = (match: string, key: string) => {
    // Look up the variable using its lowercase representation for case-insensitive matching.
    if (variableMap.has(key.toLowerCase())) {
      return variableMap.get(key.toLowerCase())!
    }
    // If not found in the map, return the original match.
    return match
  }

  let interpolated: string = text

  // 1. Format: {{NAME}}
  interpolated = interpolated.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, replacer)

  // 2. Format: ${NAME}
  interpolated = interpolated.replace(/\$\{([a-z0-9_]+)\}/gi, replacer)

  // 3. Format: $NAME
  interpolated = interpolated.replace(/\$([a-z0-9_]+)/gi, replacer)

  // 4. Format: %NAME%
  interpolated = interpolated.replace(/%([a-z0-9_]+)%/gi, replacer)

  // 5. Format: :NAME (but not in http: or https:)
  interpolated = interpolated.replace(/(?<!https?|ftp):([a-z0-9_]+)\b/gi, replacer)

  return interpolated
}
