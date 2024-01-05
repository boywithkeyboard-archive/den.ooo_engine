## den.ooo

### Setup

#### Deno

`deno.json`
```json
{
  "den.ooo": "https://esm.sh/den.ooo@1.2.0"
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

- `domain` *string* - The domain of your server, e.g. `den.ooo`.

- `versionCache` - Provide simple **set** and **get** functions that the proxy can use to cache versions of modules to reduce requests to third-party APIs. **Where** the data is stored **is up to you**.

- `fileCache` - Provide simple **set** and **get** functions that the proxy can use to cache JavaScript, TypeScript and WebAssembly files. **Where and** for **how long** the data is stored **is up to you**.

- `features`

  - `aliases` *Record<string, string>* **(default: `{}`)**
  - `typesHeader` *boolean* **(default: `false`)**
  - `importMapResolution` *boolean* **(default: `false`)**
  - `enforceSemVer` *boolean* **(default: `true`)**
  <!-- - `cachingStrategy` *lazy/eager* **(default: `eager`)**

    If `cachingStrategy` is set to `lazy`, the script will only fetch and cache each file separately when they're requested. If you've set it to `eager`, the script will instead attempt to download the entire module graph and cache it as an eszip file.
    
    `eager` is generally recommended as it automatically falls back to `lazy` if the cache doesn't yet contain the eszip file. The **eszip file will be generated in the background**, so it won't affect your response times.

    `lazy` is recommended if you're limited for whatever reason in how big your cache can get and therefore need to save space. -->

### Stability

All features of den.ooo have been repeatedly tested. Should you nevertheless encounter an unexpected problem, please make sure to [open a new issue](https://github.com/dendotooo/den.ooo/issues/new) to draw our attention to the bug so that we can fix it as quickly as possible.

### Want to deploy your own registry?

If you're interested in deploying your own version of den.ooo, feel free to **take inspiration from the below examples**, or if you don't want to waste too much time, [use our starter template for Railway](https://github.com/dendotooo/template) instead.

- ☁️ **Cloudflare Workers**

  - [Module Aliases](https://github.com/dendotooo/den.ooo/blob/main/examples/cloudflare_workers/module_aliases.js)
  - [Redis Version Cache (over HTTP)](https://github.com/dendotooo/den.ooo/blob/main/examples/cloudflare_workers/upstash_version_cache.js)

- 🦕 **Deno**

  - [Module Aliases](https://github.com/dendotooo/den.ooo/blob/main/examples/deno/module_aliases.js)
  - [Redis Version Cache (over TCP)](https://github.com/dendotooo/den.ooo/blob/main/examples/deno/redis_version_cache.js)
