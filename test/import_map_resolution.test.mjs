import test from 'node:test'
import { getText } from './_.mjs'
import assert from 'node:assert'

test('import map resolution', async () => {
  const str = await getText('https://raw.githubusercontent.com/dendotooo/testing/b/random_imports.js')

  assert.strictEqual(
    await getText('http://localhost:8000/testing@b/random_imports.js'),
    str
      .replace(`from 'random'`, `from './random.js'`)
      .replace(`from 'std/fs/copy.ts'`, `from 'https://deno.land/std@0.210.0/fs/copy.ts'`)
  )
})
