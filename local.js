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
      cheetah: 'gh/cheetahstudio/cheetah'
    },
    importMapResolution: true,
    typesHeader: true
  }
})

await registry.serve()
