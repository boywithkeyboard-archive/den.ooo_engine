import assert from 'node:assert'
import test from 'node:test'
import { getText } from './_.mjs'

test('aliases', async (t) => {
  await t.test('github', async () => { // github should be same
    assert.strictEqual(
      await getText('http://localhost:8000/testing@a/mod.js'),
      await getText('https://raw.githubusercontent.com/dendotooo/testing/a/mod.js')
    )

    assert.strictEqual(
      await getText('http://localhost:8000/testing/foo/index.js'),
      await getText('https://raw.githubusercontent.com/dendotooo/testing/b/foo/index.js')
    )
  })

  await t.test('npm', async () => {
    assert.strictEqual(
      await getText('http://localhost:8000/authenticus@3.0.0'),
      await getText('https://cdn.jsdelivr.net/npm/authenticus@3.0.0/+esm')
    )

    assert.strictEqual(
      await getText('http://localhost:8000/bytes@4.1.0'),
      await getText('https://cdn.jsdelivr.net/npm/@boywithkeyboard/bytes@4.1.0/+esm')
    )
  })
})
