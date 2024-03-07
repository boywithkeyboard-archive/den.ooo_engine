import semver from 'semver'
import { respondWithError } from '../respondWithError.ts'
import { rewriteContent } from '../rewriteContent.ts'
import { Handler, HandlerContext } from '../types.ts'

function parseUrl(url: URL) {
  const pieces = url.pathname.split('/').slice(2)
  const isScoped = pieces[0].startsWith('@')

  let name: string
  let version: string | null = null
  let submodulePath: string

  if (isScoped) {
    const includesVersion = pieces[1].includes('@')

    if (includesVersion) {
      version = pieces[1].split('@')[1]
      pieces[1] = pieces[1].split('@')[0]
      name = pieces.slice(0, 2).join('/')
    } else {
      name = pieces.slice(0, 2).join('/')
    }

    submodulePath = '/' + pieces.slice(2).join('/')
  } else {
    const includesVersion = pieces[0].includes('@')

    if (includesVersion) {
      name = pieces[0].split('@')[0]
      version = pieces[0].split('@')[1]
    } else {
      name = pieces[0]
    }

    submodulePath = '/' + pieces.slice(1).join('/')
  }

  return {
    name,
    version,
    submodulePath,
  }
}

async function fetchVersions(
  ctx: HandlerContext,
  data: ReturnType<typeof parseUrl>,
): Promise<string[]> {
  const cachedVersions = await ctx.versionCache.get(`npm:${data.name}`)

  if (cachedVersions) {
    return cachedVersions
  }

  const res = await fetch(`https://registry.npmjs.org/${data.name}`)

  if (!res.ok) {
    return []
  }

  let { versions } = await res.json() as { versions: string[] }

  versions = Object.keys(versions)

  await ctx.versionCache.set(`npm:${data.name}`, versions)

  return versions.filter((version) => semver.valid(version))
}

export const handle: Handler = async (ctx) => {
  const data = parseUrl(ctx.url)

  // if there's no version tag
  if (data.version === null) {
    const versions = await fetchVersions(ctx, data)

    if (versions.length === 0) {
      return respondWithError('BAD_MODULE')
    }

    data.version = semver.rsort(versions)[0]
    // if there's an invalid version tag or range
  } else if (semver.valid(data.version) === null) {
    if (semver.validRange(data.version) === null) {
      return respondWithError('BAD_VERSION')
    }

    const versions = await fetchVersions(ctx, data)

    if (versions.length === 0) {
      return respondWithError('BAD_MODULE')
    }

    const suggestedVersion = semver.maxSatisfying(versions, data.version)

    if (suggestedVersion === null) {
      return respondWithError('BAD_VERSION')
    }

    data.version = suggestedVersion
  }

  if (ctx.url.searchParams.has('tgz') || ctx.url.searchParams.has('tar.gz')) {
    return Response.redirect(
      `https://registry.npmjs.org/${data.name}/-/${data.name}-${data.version}.tgz`,
      307,
    )
  }

  const res = await fetch(
    `https://cdn.jsdelivr.net/npm/${data.name}@${data.version}${
      data.submodulePath === '/' ? '' : data.submodulePath
    }/+esm`,
  )

  if (!res.ok) {
    return respondWithError('UNINDEXED_MODULE')
  }

  let content = await res.text()

  content = rewriteContent(content, ({ url }) => {
    // e.g. /npm/lru-cache@6.0.0/+esm
    if (/^\/npm(\/[^\/]+)+\/\+esm$/.test(url)) {
      url = url.replace(
        '/npm',
        ctx.url.protocol + '//' + ctx.url.hostname + '/npm',
      )
      url = url.slice(0, -5) // remove /+esm
    }

    return url
  })

  return new Response(content, {
    headers: {
      'cache-control': `public, max-age=${ctx.cacheDurationInHours * 3600}`,
      'content-type': 'text/javascript; charset=utf-8',
      'x-typescript-types': `https://esm.sh/${data.name}@${data.version}${
        data.submodulePath === '/' ? '' : data.submodulePath
      }?target=es2022`,
    },
  })
}
