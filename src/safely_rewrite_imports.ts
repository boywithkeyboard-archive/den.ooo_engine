import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const REGEX =
  /(?:(?<=(?:import|export)[^`'"]*from\s+[`'"])(?<path1>[^`'"]+)(?=(?:'|"|`)))|(?:\b(?:import|export)(?:\s+|\s*\(\s*)[`'"](?<path2>[^`'"]+)[`'"])/g

export function rewriteImportsInFile(
  str: string,
  importMap: Record<string, string>
): string {
  return str.replace(REGEX, str => {
    if (importMap[str])
      return str.replace(str, importMap[str])

    for (const key in importMap) {
      if (!key.endsWith('/'))
        continue

      if (str.startsWith(key))
        return str.replace(key, importMap[key])
    }

    return str
  })
}

export function safelyRewriteImports(
  str: string,
  denoConfig: string
) {
  try {
    const json = JSON.parse(denoConfig)

    if (!Value.Check(Type.Record(Type.String(), Type.Any()), json))
      throw ''

    if (!json.imports || !Value.Check(Type.Record(Type.String(), Type.String()), json.imports))
      throw ''

    const importMap = json.imports as Record<string, string>

    return rewriteImportsInFile(str, importMap)
  } catch (_err) {
    return str
  }
}
