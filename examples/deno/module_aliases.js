import { Registry } from 'https://esm.sh/den.ooo@1.0.1'
import { GitHub, GitLab, NPM } from 'https://esm.sh/den.ooo@1.0.1/resolvers'

const registry = new Registry({
  domain: 'example.com',
  resolvers: [ // you don't have to use all official resolvers
    GitHub,
    GitLab,
    NPM // you can also add custom ones here
  ],
  features: {
    aliases: {
      foo: 'gh/user/repository', // https://example.com/gh/user/repository/example.ts -> https://example.com/foo/example.ts
      bar: 'npm/package', // https://example.com/npm/package -> https://example.com/bar
      another_gitlab_repository: 'gl/user/repository' // https://example.com/gl/user/repository/example.ts -> https://example.com/another_gitlab_repository/example.ts
    }
  }
})

registry.serve() // start the proxy
