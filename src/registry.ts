import * as semver from 'semver'
import { Resolver } from '.'
import { ModuleData } from './resolver'
import { isDev } from './is_dev'

export type VersionCache = {
  /**
   * @param maxAge Amount of seconds to store the data for.
   */
  set: (key: string, value: string[]) => Promise<void>
  get: <T extends string | string[] = never>(key: string) => Promise<T | undefined> | (T | undefined)
}

export type FileCache = {
  set: (key: string, value: string) => Promise<void>
  get: (key: string) => Promise<string | undefined>
}

function getLatestVersion(versions: string[]) {
  versions = versions.filter(version => semver.valid(version) !== null) // just for safety

  versions = semver.rsort(versions)

  return versions[0]
}

export class Registry {
  #resolvers

  versionCache: VersionCache
  fileCache: FileCache
  domain: string
  options: {
    aliases: Record<string, string>
    typesHeader: boolean
    importMapResolution: boolean
  }

  constructor({
    domain,
    versionCache,
    fileCache,
    resolvers,
    features: {
      aliases = {},
      typesHeader = false,
      importMapResolution = false
    } = {}
  }: {
    resolvers: Resolver[],
    versionCache?: VersionCache
    domain: string
    fileCache?: FileCache
    features?: {
      aliases?: Record<string, string>
      typesHeader?: boolean
      importMapResolution?: boolean
    }
  }) {
    this.#resolvers = resolvers
    this.domain = domain
    this.versionCache = versionCache ?? {
      async set(_k: string, _v: string[]) {},
      async get(_k: string) {
        return undefined
      }
    }
    this.fileCache = fileCache ?? {
      async set(_k: string, _v: string) {},
      async get(_k: string) {
        return undefined
      }
    }
    this.options = {
      aliases,
      typesHeader,
      importMapResolution
    }
  }

  fetch = async (req: Request): Promise<Response> => {
    const url = new URL(req.url)
    , pieces = url.pathname.split('/')

    , originalPathname = url.pathname.split('/')

    let wasAlias = false

    if (pieces[1].includes('@')) {
      if (this.options.aliases[pieces[1].split('@')[0]]) {
        pieces[1] = this.options.aliases[pieces[1].split('@')[0]] + '@' + pieces[1].split('@')[1]
        
        url.pathname = pieces.join('/')
  
        wasAlias = true
      }
    } else {
      if (this.options.aliases[pieces[1]]) {
        pieces[1] = this.options.aliases[pieces[1]]
        
        url.pathname = pieces.join('/')
  
        wasAlias = true
      }
    }

    const resolver = this.#resolvers.filter(r => {
      return r.pathname.test(url.pathname)
    })[0] as Resolver | undefined

    if (!resolver)
      return new Response('Not Found', {
        status: 404
      })

    const data = resolver.parseUrl(url)

    if (data.version === null) {
      const versions = await resolver.fetchVersions(this, data)

      if (versions.length === 0)
        return new Response('Not Found', {
          status: 404
        })

      const version = getLatestVersion(versions)

      data.version = version

      if (wasAlias) {
        originalPathname[1] += `@${version}`

        return Response.redirect(`${isDev() ? 'http' : 'https'}://${this.domain}${originalPathname.join('/')}`, 307)
      } else {
        return Response.redirect(resolver.getRedirectUrl(this, data as ModuleData), 307)
      }
    } else {
      if (semver.valid(data.version) === null)
        return new Response('Not Found', {
          status: 404
        })
    }

    const result = await resolver.resolveModule(this, data as ModuleData, {
      typesHeader: this.options.typesHeader,
      importMapResolution: this.options.importMapResolution
    })

    if (result.content === null)
      return new Response('Not Found', {
        status: 404
      })

    return new Response(result.content, {
      headers: result.headers
    })
  }

  serve = ({
    hostname = '0.0.0.0',
    port = Number(Deno?.env.get('PORT') ?? '8000')
  }: {
    hostname?: string
    port?: number
  } = {}) => {
    return Deno?.serve({
      hostname,
      port
    }, req => this.fetch(req)).finished
  }
}
