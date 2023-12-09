import { Registry } from './build/index.mjs'
import { GitHub, GitLab, NPM } from './build/resolvers/index.mjs'

const registry = new Registry({
  resolvers: [
    GitHub,
    GitLab,
    NPM
  ]
})

await registry.serve()
