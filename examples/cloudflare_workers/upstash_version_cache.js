import { Redis } from '@upstash/redis'
import { Registry } from 'den.ooo'
import { GitHub, GitLab, NPM } from 'den.ooo/resolvers'

const redis = new Redis({
  url: '...',
  token: '...'
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

export default registry
