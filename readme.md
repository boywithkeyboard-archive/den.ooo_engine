## den.ooo

### Setup

```bash
npm i den.ooo
```

### Usage

```ts
import { Proxy } from 'den.ooo'
import { DenoAdapter } from 'den.ooo/adapters'
import { GitHub, GitLab, NPM } from 'den.ooo/resolvers'
```

```ts
const proxy = new Proxy({
  resolvers: [
    GitHub,
    GitLab,
    NPM
  ],
  ... // see below for more detailed customization
})

proxy
  .serveWith(DenoAdapter)
```

### Customization

- `domain` *string* - The domain of your server, e.g. `den.ooo`.

- `versionCache` - Provide simple **set** and **get** functions that the proxy can use to cache versions of modules to reduce requests to third-party APIs. **Where** the data is stored **is up to you**.

- `fileCache` - Provide simple **set** and **get** functions that the proxy can use to cache JavaScript, TypeScript and WebAssembly files. **Where and** for **how long** the data is stored **is up to you**.

- `features`

  - `aliases` *Record<string, string>*
  - `typesHeader` *boolean*
  - `importMapResolution` *boolean*
