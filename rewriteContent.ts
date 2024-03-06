const REGEX =
  /(?:(?<=(?:import|export)[^`'"]*from(\s+)?[`'"])(?<path1>[^`'"]+)(?=(?:'|"|`)))|(?:\b(?:import|export)(?:\s+|\s*\(\s*)[`'"](?<path2>[^`'"]+)[`'"])/g

/**
 * Rewrite imports and exports in a string.
 * 
 * @example
 * 
 * ```ts
 * let fileContent = await Deno.readTextFile('./file.js')
 * 
 * fileContent = rewriteContent(fileContent, ({ url }) => {
 *   return url.replace('https://esm.sh/', 'npm:')
 * })
 * ```
 */
export function rewriteContent(fileContent: string, replacer: (data: { url: string }) => string) {
  return fileContent.replace(REGEX, (url) => {
    return replacer({ url })
  })
}
