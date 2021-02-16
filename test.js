'use strict'

var test = require('tape')
var retext = require('retext')
var spacing = require('.')

var mixed = [
  'One sentence. Two sentences.',
  '',
  'One sentence.  Two sentences.',
  '',
  'One sentence.\nTwo sentences.'
].join('\n')

test('sentenceSpacing(value[, size])', function (t) {
  var zero = [0, 'newline']
  var one = [null, 'space', 1]
  var two = [2, 'double-space']

  retext()
    .use(spacing, {preferred: 1})
    .process(mixed, function (error, file) {
      t.deepEqual(
        JSON.parse(JSON.stringify([error].concat(file.messages))),
        [
          null,
          {
            message: 'Expected `1` space between sentences, not `2`',
            name: '3:14-3:16',
            reason: 'Expected `1` space between sentences, not `2`',
            line: 3,
            column: 14,
            location: {
              start: {line: 3, column: 14, offset: 43},
              end: {line: 3, column: 16, offset: 45}
            },
            source: 'retext-sentence-spacing',
            ruleId: 'space',
            fatal: false,
            actual: '  ',
            expected: [' ']
          }
        ],
        'should emit messages'
      )
    })

  one.forEach(function (pref) {
    retext()
      .use(spacing, {preferred: pref})
      .process(mixed, function (error, file) {
        t.deepEqual(
          [error].concat(file.messages.map(String)),
          [null, '3:14-3:16: Expected `1` space between sentences, not `2`'],
          'should catch double spaces when preferred == ' + pref
        )
      })
  })

  two.forEach(function (pref) {
    retext()
      .use(spacing, {preferred: pref})
      .process(mixed, function (error, file) {
        t.deepEqual(
          [error].concat(file.messages.map(String)),
          [null, '1:14-1:15: Expected `2` spaces between sentences, not `1`'],
          'should catch single spaces when preferred == ' + pref
        )
      })
  })

  zero.forEach(function (pref) {
    retext()
      .use(spacing, {preferred: pref})
      .process(mixed, function (error, file) {
        t.deepEqual(
          [error].concat(file.messages.map(String)),
          [
            null,
            '1:14-1:15: Expected a newline between sentences, not `1` space',
            '3:14-3:16: Expected a newline between sentences, not `2` spaces'
          ],
          'should catch spaces when preferred == ' + pref
        )
      })
  })

  retext()
    .use(spacing)
    .process('One sentence.   Three sentences.', function (error, file) {
      t.deepEqual(
        [error].concat(file.messages.map(String)),
        [null, '1:14-1:17: Expected `1` space between sentences, not `3`'],
        'should catch more than two spaces'
      )
    })

  retext()
    .use(spacing)
    .process('One sentence.\tFour sentences.', function (error, file) {
      t.deepEqual(
        [error].concat(file.messages.map(String)),
        [null],
        'should not emit messages for non-space white-space'
      )
    })

  t.throws(
    function () {
      retext().use(spacing, {preferred: -1}).freeze()
    },
    /Error: Expected `options.preferred` to be `'space'`, `'newline'`, or a `number` between \(including\) `0` and `2`/,
    'should throw for preferred lower than 1'
  )

  t.throws(
    function () {
      retext().use(spacing, {preferred: 3}).freeze()
    },
    /Error: Expected `options.preferred` to be `'space'`, `'newline'`, or a `number` between \(including\) `0` and `2`/,
    'should throw for preferred higher than 2'
  )

  t.throws(
    function () {
      retext().use(spacing, {preferred: 'foo'}).freeze()
    },
    /Error: Expected `options.preferred` to be `'space'`, `'newline'`, or a `number`/,
    'should throw for non-numbers'
  )

  t.end()
})
