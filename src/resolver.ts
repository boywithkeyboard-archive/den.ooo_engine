type ParseResult = {
  name: string
  version: string | null
  filePath: string
}

export class Resolver {
  pathname
  parseUrl
  fetchModule

  constructor(options: {
    pathname: RegExp,
    parseUrl: (url: URL) => Promise<ParseResult>
    fetchModule: (
      data: ParseResult,
      options: {
        typesHeader: boolean
        importMapResolution: boolean
      }
    ) => Promise<{
      content: string | null
      headers?: Record<string, string>
    }>
  }) {
    this.pathname = options.pathname
    this.parseUrl = options.parseUrl
    this.fetchModule = options.fetchModule
  }
}
