import { Registry } from '.'

type ParseResult = {
  name: string
  version: string | null
  filePath: string
}

export type ModuleData = Omit<ParseResult, 'version'> & { version: string }

export class Resolver {
  pathname
  parseUrl
  fetchVersions
  resolveModule
  getRedirectUrl

  constructor(options: {
    pathname: RegExp,
    parseUrl: (url: URL) => ParseResult
    fetchVersions: (registry: Registry, data: ParseResult) => Promise<string[]>
    resolveModule: (
      registry: Registry,
      data: ModuleData,
      options: {
        typesHeader: boolean
        importMapResolution: boolean
      }
    ) => Promise<{
      content: string | null
      headers?: Record<string, string>
    }>
    getRedirectUrl: (registry: Registry, data: ModuleData) => string
  }) {
    this.pathname = options.pathname
    this.parseUrl = options.parseUrl
    this.fetchVersions = options.fetchVersions
    this.resolveModule = options.resolveModule
    this.getRedirectUrl = options.getRedirectUrl
  }
}
