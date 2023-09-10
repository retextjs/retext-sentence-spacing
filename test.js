import assert from 'node:assert/strict'
import test from 'node:test'
import {retext} from 'retext'
import retextSentenceSpacing from './index.js'

const mixed = [
  'One sentence. Two sentences.',
  '',
  'One sentence.  Two sentences.',
  '',
  'One sentence.\nTwo sentences.'
].join('\n')

test('retextSentenceSpacing', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'default'
    ])
  })

  await t.test('should emit a message w/ metadata', async function () {
    const file = await retext()
      .use(retextSentenceSpacing, {preferred: 1})
      .process(mixed)

    assert.deepEqual(
      JSON.parse(JSON.stringify({...file.messages[0], ancestors: []})),
      {
        ancestors: [],
        column: 14,
        fatal: false,
        message: 'Expected `1` space between sentences, not `2`',
        line: 3,
        name: '3:14-3:16',
        place: {
          start: {line: 3, column: 14, offset: 43},
          end: {line: 3, column: 16, offset: 45}
        },
        reason: 'Expected `1` space between sentences, not `2`',
        ruleId: 'space',
        source: 'retext-sentence-spacing',
        actual: '  ',
        expected: [' '],
        url: 'https://github.com/retextjs/retext-sentence-spacing#readme'
      }
    )
  })

  const ones = /** @type {const} */ ([null, 'space', 1])
  const twos = /** @type {const} */ ([2, 'double-space'])
  const zeros = /** @type {const} */ ([0, 'newline'])

  await Promise.all(
    ones.map(function (preferred) {
      return t.test(
        'should catch double spaces w/ `' + preferred + '`',
        async function () {
          const file = await retext()
            .use(retextSentenceSpacing, {preferred})
            .process(mixed)

          assert.deepEqual(file.messages.map(String), [
            '3:14-3:16: Expected `1` space between sentences, not `2`'
          ])
        }
      )
    })
  )

  await Promise.all(
    twos.map(function (preferred) {
      return t.test(
        'should catch single spaces w/ `' + preferred + '`',
        async function () {
          const file = await retext()
            .use(retextSentenceSpacing, {preferred})
            .process(mixed)

          assert.deepEqual(file.messages.map(String), [
            '1:14-1:15: Expected `2` spaces between sentences, not `1`'
          ])
        }
      )
    })
  )

  await Promise.all(
    zeros.map(function (preferred) {
      return t.test(
        'should catch spaces w/ `' + preferred + '`',
        async function () {
          const file = await retext()
            .use(retextSentenceSpacing, {preferred})
            .process(mixed)

          assert.deepEqual(file.messages.map(String), [
            '1:14-1:15: Expected a newline between sentences, not `1` space',
            '3:14-3:16: Expected a newline between sentences, not `2` spaces'
          ])
        }
      )
    })
  )

  await t.test('should catch more than two spaces', async function () {
    const file = await retext()
      .use(retextSentenceSpacing)
      .process('One sentence.   Three sentences.')

    assert.deepEqual(file.messages.map(String), [
      '1:14-1:17: Expected `1` space between sentences, not `3`'
    ])
  })

  await t.test(
    'should not emit messages for non-space whitespace',
    async function () {
      const file = await retext()
        .use(retextSentenceSpacing)
        .process('One sentence.\tFour sentences.')

      assert.deepEqual(file.messages.map(String), [])
    }
  )
})
