/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module retext-sentence-spacing
 * @fileoverview Test suite for `retext-sentence-spacing`.
 */

'use strict';

/* Dependencies. */
var test = require('tape');
var retext = require('retext');
var spacing = require('./');

var mixed = [
  'One sentence. Two sentences.',
  '',
  'One sentence.  Two sentences.'
].join('\n');

var many = 'One sentence.   Three sentences.';

var nonSpace = 'One sentence.\tFour sentences.';

/* Tests. */
test('retext-sentence-spacing(value[, size])', function (t) {
  [null, 1].forEach(function (pref) {
    t.equal(
      String(retext().use(spacing, {preferred: pref}).process(mixed).messages),
      '3:14-3:16: Expected `1` space between sentences, not `2`',
      'should catch double spaces when preferred == ' + pref
    );
  });

  t.equal(
    String(retext().use(spacing, {preferred: 2}).process(mixed).messages),
    '1:14-1:15: Expected `2` spaces between sentences, not `1`',
    'should catch single spaces when preferred == 2'
  );

  t.equal(
    String(retext().use(spacing).process(many).messages),
    '1:14-1:17: Expected `1` space between sentences, not `3`',
    'should catch more than two spaces'
  );

  t.equal(
    String(retext().use(spacing).process(nonSpace).messages),
    '',
    'should not emit messages for non-space white-space'
  );

  t.end();
});
