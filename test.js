import test from 'tape'
import {retext} from 'retext'
import retextSentenceSpacing from './index.js'

const mixed = [
  'One sentence. Two sentences.',
  '',
  'One sentence.  Two sentences.',
  '',
  'One sentence.\nTwo sentences.'
].join('\n')

test('retext-sentence-spacing', (t) => {
  t.plan(13)

  retext()
    .use(retextSentenceSpacing, {preferred: 1})
    .process(mixed)
    .then((file) => {
      t.deepEqual(
        JSON.parse(JSON.stringify(file.messages)),
        [
          {
            name: '3:14-3:16',
            message: 'Expected `1` space between sentences, not `2`',
            reason: 'Expected `1` space between sentences, not `2`',
            line: 3,
            column: 14,
            source: 'retext-sentence-spacing',
            ruleId: 'space',
            position: {
              start: {line: 3, column: 14, offset: 43},
              end: {line: 3, column: 16, offset: 45}
            },
            fatal: false,
            actual: '  ',
            expected: [' ']
          }
        ],
        'should emit messages'
      )
    }, t.ifErr)

  one(null)
  one('space')
  one(1)
  two(2)
  two('double-space')
  zero(0)
  zero('newline')

  function one(pref) {
    retext()
      .use(retextSentenceSpacing, {preferred: pref})
      .process(mixed)
      .then((file) => {
        t.deepEqual(
          file.messages.map((d) => String(d)),
          ['3:14-3:16: Expected `1` space between sentences, not `2`'],
          'should catch double spaces when preferred == ' + pref
        )
      }, t.ifErr)
  }

  function two(pref) {
    retext()
      .use(retextSentenceSpacing, {preferred: pref})
      .process(mixed)
      .then((file) => {
        t.deepEqual(
          file.messages.map((d) => String(d)),
          ['1:14-1:15: Expected `2` spaces between sentences, not `1`'],
          'should catch single spaces when preferred == ' + pref
        )
      }, t.ifErr)
  }

  function zero(pref) {
    retext()
      .use(retextSentenceSpacing, {preferred: pref})
      .process(mixed)
      .then((file) => {
        t.deepEqual(
          file.messages.map((d) => String(d)),
          [
            '1:14-1:15: Expected a newline between sentences, not `1` space',
            '3:14-3:16: Expected a newline between sentences, not `2` spaces'
          ],
          'should catch spaces when preferred == ' + pref
        )
      }, t.ifErr)
  }

  retext()
    .use(retextSentenceSpacing)
    .process('One sentence.   Three sentences.')
    .then((file) => {
      t.deepEqual(
        file.messages.map((d) => String(d)),
        ['1:14-1:17: Expected `1` space between sentences, not `3`'],
        'should catch more than two spaces'
      )
    }, t.ifErr)

  retext()
    .use(retextSentenceSpacing)
    .process('One sentence.\tFour sentences.')
    .then((file) => {
      t.deepEqual(
        file.messages.map((d) => String(d)),
        [],
        'should not emit messages for non-space white-space'
      )
    }, t.ifErr)

  t.throws(
    () => {
      retext().use(retextSentenceSpacing, {preferred: -1}).freeze()
    },
    /Error: Expected `options.preferred` to be `'space'`, `'newline'`, or a `number` between \(including\) `0` and `2`/,
    'should throw for preferred lower than 1'
  )

  t.throws(
    () => {
      retext().use(retextSentenceSpacing, {preferred: 3}).freeze()
    },
    /Error: Expected `options.preferred` to be `'space'`, `'newline'`, or a `number` between \(including\) `0` and `2`/,
    'should throw for preferred higher than 2'
  )

  t.throws(
    () => {
      retext().use(retextSentenceSpacing, {preferred: 'foo'}).freeze()
    },
    /Error: Expected `options.preferred` to be `'space'`, `'newline'`, or a `number`/,
    'should throw for non-numbers'
  )
})
