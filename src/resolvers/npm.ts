import { encodeHex } from '../hex'
import { Resolver } from '../resolver'

export const NPM = new Resolver({
  pathname: /^\/npm\/(@[0-9a-zA-Z.-]+\/)?[0-9a-zA-Z.-]+(@[^@]+)?(\/[a-z0-9A-Z.-]+)*$/,

  parseUrl(url) {
    const pieces = url.pathname.split('/').slice(2)
    , isScoped = pieces[0].startsWith('@')

    let name: string
    , version: string | null = null
    , filePath: string

    if (isScoped) {
      const includesVersion = pieces[1].includes('@')

      if (includesVersion) {
        version = pieces[1].split('@')[1]
        pieces[1] = pieces[1].split('@')[0]
        name = pieces.slice(0, 2).join('/')
      } else {
        name = pieces.slice(0, 2).join('/')
      }

      filePath = '/' + pieces.slice(2).join('/')
    } else {
      const includesVersion = pieces[0].includes('@')

      if (includesVersion) {
        name = pieces[0].split('@')[0]
        version = pieces[0].split('@')[1]
      } else {
        name = pieces[0]
      }

      filePath = '/' + pieces.slice(1).join('/')
    }

    return {
      name,
      version,
      filePath
    }
  },

  async fetchVersions(registry, data) {
    const cachedVersions = await registry.versionCache.get<string[]>(`npm:${data.name}`)

    if (cachedVersions)
      return cachedVersions

    const res = await fetch(`https://registry.npmjs.org/${data.name}`)

    if (!res.ok)
      return []

    let { versions } = await res.json() as { versions: string[] }

    versions = Object.keys(versions)

    await registry.versionCache.set(`npm:${data.name}`, versions, 900)

    return versions
  },

  async resolveModule(registry, data, options) {
    const hex = encodeHex(`npm:${data.name}:${data.version}:${data.filePath}`)

    const cachedFile = await registry.fileCache.get(hex)

    if (cachedFile)
      return {
        content: cachedFile,
        headers: {
          'cache-control': `public, max-age=${300}`,
          'content-type': 'text/javascript; charset=utf-8',
          ...(options.typesHeader && { 'x-typescript-types': `https://esm.sh/${data.name}@${data.version}${data.filePath === '/' ? '' : data.filePath}` })
        }
      }

    const res = await fetch(`https://cdn.jsdelivr.net/npm/${data.name}@${data.version}${data.filePath === '/' ? '' : data.filePath}/+esm`)

    if (!res.ok)
      return {
        content: null
      }

    const content = await res.arrayBuffer()

    await registry.fileCache.set(hex, content)

    return {
      content,
      headers: {
        'cache-control': `public, max-age=${3600}`,
        'content-type': 'text/javascript; charset=utf-8',
        ...(options.typesHeader && { 'x-typescript-types': `https://esm.sh/${data.name}@${data.version}${data.filePath === '/' ? '' : data.filePath}` })
      }
    }
  }
})
