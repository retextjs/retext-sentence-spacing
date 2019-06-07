# retext-sentence-spacing

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**retext**][retext] plugin to check spacing between sentences.

## Install

[npm][]:

```sh
npm install retext-sentence-spacing
```

## Use

Say we have the following file, `example.txt`:

```txt
One sentence. Two sentences.

One sentence.  Two sentences.
```

…and our script, `example.js`, looks as follows:

```js
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var retext = require('retext')
var spacing = require('retext-sentence-spacing')

retext()
  .use(spacing)
  .process(vfile.readSync('example.txt'), function(err, file) {
    console.error(report(err || file))
  })
```

Yields:

```txt
example.txt
  3:14-3:16  warning  Expected `1` space between sentences, not `2`  space  retext-sentence-spacing

⚠ 1 warning
```

This plugin can be configured to prefer 2 spaces instead:

```diff
 retext()
-  .use(spacing)
+  .use(spacing, {preferred: 2})
   .process(vfile.readSync('example.txt'), function(err, file) {
```

Yields:

```txt
example.txt
  1:14-1:15  warning  Expected `2` spaces between sentences, not `1`  double-space  retext-sentence-spacing

⚠ 1 warning
```

## API

### `retext().use(sentenceSpacing[, options])`

Check spacing between sentences.
Emit warnings when the spacing does not adhere to the preferred style.

###### `options.preferred`

*   `0` (or `'newline'`) — Disallow spaces between sentences
*   `1` (or `'space'`, default) — Allow only one space between sentences
*   `2` (or `'double-space'`) — Allow only two spaces between sentences

### Messages

Each message is emitted as a [`VFileMessage`][message] on `file`, with the
following fields:

###### `message.source`

Name of this plugin (`'retext-sentence-spacing'`).

###### `message.ruleId`

Preferred style (`'newline'`, `'space'`, or `'double-space'`).

###### `message.actual`

Current not ok spacing (`string`, such as `' '`).

###### `message.expected`

List of suggestions of spacing to use (`Array.<string>`, such as `['\n']`).

## Related

*   [`retext-contractions`](https://github.com/retextjs/retext-contractions)
    — Check apostrophe use in contractions
*   [`retext-diacritics`](https://github.com/retextjs/retext-diacritics)
    — Check for proper use of diacritics
*   [`retext-quotes`](https://github.com/retextjs/retext-quotes)
    — Check quote and apostrophe usage

## Contribute

See [`contributing.md`][contributing] in [`retextjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/retextjs/retext-sentence-spacing.svg

[build]: https://travis-ci.org/retextjs/retext-sentence-spacing

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-sentence-spacing.svg

[coverage]: https://codecov.io/github/retextjs/retext-sentence-spacing

[downloads-badge]: https://img.shields.io/npm/dm/retext-sentence-spacing.svg

[downloads]: https://www.npmjs.com/package/retext-sentence-spacing

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-sentence-spacing.svg

[size]: https://bundlephobia.com/result?p=retext-sentence-spacing

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/retext

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/master/contributing.md

[support]: https://github.com/retextjs/.github/blob/master/support.md

[coc]: https://github.com/retextjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[message]: https://github.com/vfile/vfile-message
