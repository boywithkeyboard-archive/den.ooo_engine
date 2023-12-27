import { Registry } from '..'
import { filePathToContentType } from '../file_path_to_content_type'
import { encodeHex } from '../hex'
import { isDev } from '../is_dev'
import { ModuleData, Resolver } from '../resolver'
import { safelyRewriteImports } from '../safely_rewrite_imports'

export const GitLab = new Resolver({
  pathname: /^\/gl\/[^\/]+\/[^@\/]+(@[^@\/]+)?(\/[^\/]+)+\.(jsx|tsx|js|mjs|ts|wasm)$/,
  
  parseUrl(url) {
    const pieces = url.pathname.split('/').slice(2)

    let name: string
    , version: string | null = null

    const includesVersion = pieces[1].includes('@')

    if (includesVersion) {
      version = pieces[1].split('@')[1]
      pieces[1] = pieces[1].split('@')[0]
      name = pieces.slice(0, 2).join('/')
    } else {
      name = pieces.slice(0, 2).join('/')
    }

    return {
      name,
      version,
      filePath: '/' + pieces.slice(2).join('/')
    }
  },

  async fetchVersions(registry, data) {
    return []

    // const cachedVersions = await registry.versionCache.get<string[]>(`gl:${data.name}`)

    // if (cachedVersions)
    //   return cachedVersions

    // if (!gl)
    //   gl = new Gitlab({
    //     token: ''
    //   })

    // // @ts-ignore
    // const releases = await gl.ProjectReleases.all(data.name, {
    //   maxPages: 10,
    //   perPage: 100
    // })
    
    // if (releases.length > 0) {
    //   const versions = releases.map(release => release.tag_name).filter(v => semver.valid(v) !== null)

    //   await registry.versionCache.set(`gl:${data.name}`, versions)

    //   return versions
    // }

    // // @ts-ignore
    // const tags = await gl.Tags.all(data.name, {
    //   maxPages: 10,
    //   perPage: 100
    // })

    // , versions = tags.map(tag => tag.name).filter(v => semver.valid(v) !== null)

    // await registry.versionCache.set(`gl:${data.name}`, versions)

    // return versions
  },

  async resolveModule(registry, data, options) {
    const hex = encodeHex(`gl:${data.name}:${data.version}:${data.filePath}`)

    const cachedFile = await registry.fileCache.get(hex)

    let typesFile: string | null = null

    if (options.typesHeader)
      typesFile = await resolveTypesFile(registry, data)

    if (cachedFile)
      return {
        content: cachedFile,
        headers: {
          'cache-control': `public, max-age=${1800}`,
          'content-type': `${filePathToContentType(data.filePath)}; charset=utf-8`,
          ...(typesFile && { 'x-typescript-types': typesFile })
        }
      }

    const res = await fetch(`https://gitlab.com/${data.name}/-/raw/${data.version}${data.filePath}`)

    if (!res.ok)
      return {
        content: null
      }

    let content = await res.text()

    if (options.importMapResolution)
      content = await resolveImports(content, data)

    await registry.fileCache.set(hex, content)

    return {
      content,
      headers: {
        'cache-control': `public, max-age=${1800}`,
        'content-type': `${filePathToContentType(data.filePath)}; charset=utf-8`,
        ...(typesFile && { 'x-typescript-types': typesFile })
      }
    }
  },

  getRedirectUrl(registry, data) {
    return `${isDev() ? 'http' : 'https'}://${registry.domain}/gl/${data.name}@${data.version}${data.filePath}`
  }
})

async function resolveTypesFile(registry: Registry, data: ModuleData): Promise<string | null> {
  if (data.filePath.endsWith('.tsx') || data.filePath.endsWith('.wasm') || data.filePath.endsWith('.ts'))
    return null

  let filePath = data.filePath

  if (filePath.endsWith('.jsx') || filePath.endsWith('.mjs'))
    filePath = filePath.slice(0, -4)
  else
    filePath = filePath.slice(0, -3) // .js

  filePath += '.d.ts'

  const res = await fetch(`https://gitlab.com/${data.name}/-/raw/${data.version}${filePath}`)

  if (!res.ok)
    return null

  return `${isDev() ? 'http' : 'https'}://${registry.domain}/gl/${data.name}@${data.version}${filePath}`
}

async function resolveImports(content: string, data: ModuleData): Promise<string> {
  const res = await fetch(`https://gitlab.com/${data.name}/-/raw/${data.version}/deno.json`)

  if (!res.ok)
    return content

  return safelyRewriteImports(content, await res.text())
}
