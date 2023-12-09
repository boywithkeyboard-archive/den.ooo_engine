type ParseResult = {
  name: string
  version: string | null
  filePath: string
}

export class Resolver {
  pathname
  parseUrl
  resolveModule

  constructor(options: {
    pathname: RegExp,
    parseUrl: (url: URL) => Promise<ParseResult>
    resolveModule: (
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
    this.resolveModule = options.resolveModule
  }
}
