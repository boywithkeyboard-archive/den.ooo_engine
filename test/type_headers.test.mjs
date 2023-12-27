import assert from 'node:assert'
import test from 'node:test'

test('type headers', async (t) => {
  await t.test('github', async () => {
    assert.strictEqual((await fetch('http://localhost:8000/gh/dendotooo/testing/mod.js')).headers.get('x-typescript-types'), 'http://localhost:8000/gh/dendotooo/testing@b/mod.d.ts')
    assert.strictEqual((await fetch('http://localhost:8000/gh/dendotooo/testing/foo/index.js')).headers.get('x-typescript-types'), 'http://localhost:8000/gh/dendotooo/testing@b/foo/index.d.ts')
    assert.strictEqual((await fetch('http://localhost:8000/gh/dendotooo/testing/index.js')).headers.get('x-typescript-types'), 'http://localhost:8000/gh/dendotooo/testing@b/index.d.ts')
    assert.strictEqual((await fetch('http://localhost:8000/gh/boywithkeyboard/bytes/index.ts')).headers.get('x-typescript-types'), null)
  })

  // await t.test('gitlab', async () => {

  // })

  await t.test('npm', async () => {
    assert.strictEqual((await fetch('http://localhost:8000/npm/@boywithkeyboard/bytes@4.0.0')).headers.get('x-typescript-types'), 'https://esm.sh/@boywithkeyboard/bytes@4.0.0?target=es2022')
    assert.strictEqual((await fetch('http://localhost:8000/npm/@boywithkeyboard/bytes')).headers.get('x-typescript-types'), 'https://esm.sh/@boywithkeyboard/bytes@4.1.0?target=es2022')
    assert.strictEqual((await fetch('http://localhost:8000/npm/authenticus@2.0.2')).headers.get('x-typescript-types'), 'https://esm.sh/authenticus@2.0.2?target=es2022')
    assert.strictEqual((await fetch('http://localhost:8000/npm/authenticus')).headers.get('x-typescript-types'), 'https://esm.sh/authenticus@3.0.0?target=es2022')
  })
})
