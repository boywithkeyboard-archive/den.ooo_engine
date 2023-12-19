## den.ooo

### Setup

#### Deno

`deno.json`
```json
{
  "den.ooo": "https://den.ooo/npm/den.ooo@1.0.0"
}
```

#### Node.js

```bash
npm i den.ooo
```

### Usage

```ts
import { Registry } from 'den.ooo'
import { GitHub, GitLab, NPM } from 'den.ooo/resolvers'

const registry = new Registry({
  resolvers: [
    GitHub,
    GitLab,
    NPM
  ],
  ... // see below for more detailed customization
})

// Deno
await registry.serve()

// Cloudflare Workers
export default registry
```

### Customization

- `domain` *string* - The domain of your server, e.g. `den.ooo`.

- `versionCache` - Provide simple **set** and **get** functions that the proxy can use to cache versions of modules to reduce requests to third-party APIs. **Where** the data is stored **is up to you**.

- `fileCache` - Provide simple **set** and **get** functions that the proxy can use to cache JavaScript, TypeScript and WebAssembly files. **Where and** for **how long** the data is stored **is up to you**.

- `features`

  - `aliases` *Record<string, string>*
  - `typesHeader` *boolean*
  - `importMapResolution` *boolean*

### Want to deploy your own registry?

If you're interested in deploying your own version of den.ooo, feel free to **take inspiration from the below examples**, or if you don't want to waste too much time, [use our starter template for Railway](https://github.com/dendotooo/template) instead.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/zHcmpg?referralCode=_LFOM3)

### Examples

- ☁️ **Cloudflare Workers**

  - [Module Aliases](https://github.com/dendotooo/den.ooo/blob/main/examples/cloudflare_workers/module_aliases.js)
  - [Redis Version Cache (over HTTP)](https://github.com/dendotooo/den.ooo/blob/main/examples/cloudflare_workers/upstash_version_cache.js)

- 🦕 **Deno**

  - [Module Aliases](https://github.com/dendotooo/den.ooo/blob/main/examples/deno/module_aliases.js)
  - [Redis Version Cache (over TCP)](https://github.com/dendotooo/den.ooo/blob/main/examples/deno/redis_version_cache.js)
