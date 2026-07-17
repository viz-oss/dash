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
export function parseVariables(text: string, variables: Record<string, string>): string {
  // Helper function: if the variable exists in the dictionary, replace it.
  // Otherwise, leave the original text.
  const replacer: (match: string, key: string) => string = (match: string, key: string) =>
    variables[key] ?? match

  let interpolated: string = text

  // 1. Format: {{NAME}}
  interpolated = interpolated.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, replacer)

  // 2. Format: ${NAME}
  interpolated = interpolated.replace(/\$\{([a-zA-Z0-9_]+)\}/g, replacer)

  // 3. Format: $NAME
  interpolated = interpolated.replace(/\$([a-zA-Z0-9_]+)/g, replacer)

  // 4. Format: %NAME%
  interpolated = interpolated.replace(/%([a-zA-Z0-9_]+)%/g, replacer)

  // 5. Format: :NAME (but not in http: or https:)
  interpolated = interpolated.replace(/(?<!https?|ftp):([a-zA-Z0-9_]+)\b/g, replacer)

  return interpolated
}
