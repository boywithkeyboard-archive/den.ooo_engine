import { Registry } from './build/index.mjs'
import { GitHub, GitLab, NPM } from './build/resolvers/index.mjs'

const registry = new Registry({
  domain: 'localhost:8000',
  resolvers: [
    GitHub,
    GitLab,
    NPM
  ],
  features: {
    aliases: {
      authenticus: 'npm/authenticus',
      bytes: 'npm/@boywithkeyboard/bytes',
      testing: 'gh/dendotooo/testing',
    },
    importMapResolution: true,
    typesHeader: true,
    enforceSemVer: false
  }
})

await registry.serve()
