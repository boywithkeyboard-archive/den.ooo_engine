import { Registry } from './registry.ts'

const REGEX =
  /(?:(?<=(?:import|export)[^`'"]*from\s+[`'"])(?<path1>[^`'"]+)(?=(?:'|"|`)))|(?:\b(?:import|export)(?:\s+|\s*\(\s*)[`'"](?<path2>[^`'"]+)[`'"])/g

/**
 * Cache a file recursively.
 */
export async function cacheUrl(registry: Registry, url: string) {
  // #1 cache file
  const res = await fetch(url)

  if (!res.ok) {
    return
  }

  const str = await res.text()

  await registry.fileCache.set(url, str)

  // #2 walk through imports

  for (const url of str.matchAll(REGEX)) {
    await cacheUrl(registry, url[0])
  }
}
