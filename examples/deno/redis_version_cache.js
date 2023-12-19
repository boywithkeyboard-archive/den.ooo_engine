import { Registry } from 'https://esm.sh/den.ooo@1.0.1'
import { GitHub, GitLab, NPM } from 'https://esm.sh/den.ooo@1.0.1/resolvers'
import { connect } from 'https://deno.land/x/redis@v0.32.0/mod.ts'

const redis = await connect({
  hostname: '...',
  port: '...',
  username: '...',
  password: '...'
})

const registry = new Registry({
  domain: 'example.com',
  resolvers: [ // you don't have to use all official resolvers
    GitHub,
    GitLab,
    NPM // you can also add custom ones here
  ],
  features: {
    // enable the features you want
  },
  versionCache: {
    async set(key, value) {
      await redis.set(key, JSON.stringify(value), {
        ex: 900 // cache for 15 minutes
      })
    },

    async get(key) {
      const data = await redis.get(key)

      return !data ? undefined : JSON.parse(data) // parse result
    }
  }
})

registry.serve() // start the proxy
