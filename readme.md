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

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

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
import {readSync} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {retext} from 'retext'
import retextSentenceSpacing from 'retext-sentence-spacing'

const file = readSync('example.txt')

retext()
  .use(retextSentenceSpacing)
  .process(file)
  .then((file) => {
    console.error(reporter(file))
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
-  .use(retextSentenceSpacing)
+  .use(retextSentenceSpacing, {preferred: 2})
   .process(vfile.readSync('example.txt'), function(err, file) {
```

Yields:

```txt
example.txt
  1:14-1:15  warning  Expected `2` spaces between sentences, not `1`  double-space  retext-sentence-spacing

⚠ 1 warning
```

## API

This package exports no identifiers.
The default export is `retextSentenceSpacing`.

### `unified().use(retextSentenceSpacing[, options])`

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

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/retextjs/retext-sentence-spacing/workflows/main/badge.svg

[build]: https://github.com/retextjs/retext-sentence-spacing/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-sentence-spacing.svg

[coverage]: https://codecov.io/github/retextjs/retext-sentence-spacing

[downloads-badge]: https://img.shields.io/npm/dm/retext-sentence-spacing.svg

[downloads]: https://www.npmjs.com/package/retext-sentence-spacing

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-sentence-spacing.svg

[size]: https://bundlephobia.com/result?p=retext-sentence-spacing

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/retextjs/.github/blob/HEAD/support.md

[coc]: https://github.com/retextjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[message]: https://github.com/vfile/vfile-message
