'use strict'

var test = require('tape')
var retext = require('retext')
var spacing = require('.')

var mixed = [
  'One sentence. Two sentences.',
  '',
  'One sentence.  Two sentences.'
].join('\n')

var many = 'One sentence.   Three sentences.'

var nonSpace = 'One sentence.\tFour sentences.'

test('retext-sentence-spacing(value[, size])', function(t) {
  var one = [null, 'space', 1]

  one.forEach(function(pref) {
    t.equal(
      String(
        retext()
          .use(spacing, {preferred: pref})
          .processSync(mixed).messages
      ),
      '3:14-3:16: Expected `1` space between sentences, not `2`',
      'should catch double spaces when preferred == ' + pref
    )
  })

  t.equal(
    String(
      retext()
        .use(spacing, {preferred: 2})
        .processSync(mixed).messages
    ),
    '1:14-1:15: Expected `2` spaces between sentences, not `1`',
    'should catch single spaces when preferred == 2'
  )

  t.equal(
    String(
      retext()
        .use(spacing)
        .processSync(many).messages
    ),
    '1:14-1:17: Expected `1` space between sentences, not `3`',
    'should catch more than two spaces'
  )

  t.equal(
    String(
      retext()
        .use(spacing)
        .processSync(nonSpace).messages
    ),
    '',
    'should not emit messages for non-space white-space'
  )

  t.throws(
    function() {
      retext()
        .use(spacing, {preferred: 0})
        .freeze()
    },
    /Error: Expected `options.preferred` to be `1` or `2`/,
    'should throw for preferred lower than 1'
  )

  t.throws(
    function() {
      retext()
        .use(spacing, {preferred: 3})
        .freeze()
    },
    /Error: Expected `options.preferred` to be `1` or `2`/,
    'should throw for preferred higher than 2'
  )

  t.throws(
    function() {
      retext()
        .use(spacing, {preferred: 'foo'})
        .freeze()
    },
    /Error: Expected `options.preferred` to be `'space'` or a `number`/,
    'should throw for non-numbers'
  )

  t.end()
})
