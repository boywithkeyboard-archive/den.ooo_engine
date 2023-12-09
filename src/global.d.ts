declare global {
  const Deno: {
    env: {
      get: (key: string) => string | undefined
    }
    serve: (options: {
      hostname: string
      port: number
    }, handler: (req: Request) => Promise<Response>) => {
      finished: Promise<void>
    }
  } | undefined
}

export {}
