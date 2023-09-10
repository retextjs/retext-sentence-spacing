# retext-sentence-spacing

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[retext][]** plugin to check spacing between sentences.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(retextSentenceSpacing[, options])`](#unifieduseretextsentencespacing-options)
    *   [`Options`](#options)
*   [Messages](#messages)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([retext][]) plugin to check spacing between
sentences.
For example, it can check for one or two spaces sentences.

## When should I use this?

You can opt-into this plugin when you’re dealing with content that might contain
mistakes, and have authors that can fix that content.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install retext-sentence-spacing
```

In Deno with [`esm.sh`][esmsh]:

```js
import retextSentenceSpacing from 'https://esm.sh/retext-sentence-spacing@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import retextSentenceSpacing from 'https://esm.sh/retext-sentence-spacing@5?bundle'
</script>
```

## Use

Say our document `example.txt` contains:

```txt
One sentence. Two sentences.

One sentence.  Two sentences.
```

…and our module `example.js` contains:

```js
import {retext} from 'retext'
import retextSentenceSpacing from 'retext-sentence-spacing'
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'

const file = await retext()
  .use(retextSentenceSpacing)
  .process(await read('example.txt'))

console.error(reporter(file))
```

…then running `node example.js` yields:

```txt
example.txt
3:14-3:16 warning Unexpected 2 spaces between sentence, expected 1 space space retext-sentence-spacing

⚠ 1 warning
```

The default is to check for 1 space, which can be changed.
For example, to 2 spaces:

```diff
 const file = await retext()
-  .use(retextSentenceSpacing)
+  .use(retextSentenceSpacing, {preferred: 'double-space'})
   .process(await read('example.txt'))
```

…now running `node example.js` once again yields:

```txt
example.txt
1:14-1:15 warning Unexpected 1 space between sentence, expected 2 spaces double-space retext-sentence-spacing

⚠ 1 warning
```

## API

This package exports no identifiers.
The default export is [`retextSentenceSpacing`][api-retext-sentence-spacing].

### `unified().use(retextSentenceSpacing[, options])`

Check spacing between sentences.

###### Parameters

*   `options` ([`Options`][api-options], optional)
    — configuration

###### Returns

Transform ([`Transformer`][unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Fields

*   `preferred` (`'double-space'`, `'newline'`, `'space'`, `0`, `1`, `2`,
    default: `'space'`)
    — spaces to use

## Messages

Each message is emitted as a [`VFileMessage`][vfile-message] on `file`, with
`source` set to `'retext-sentence-spacing'`, `ruleId` to the preferred style
(`'newline'`, `'space'`, or `'double-space'`), `actual` to the unexpected
value, and `expected` to the expected value.

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Options`][api-options].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`retext-sentence-spacing@^5`, compatible with Node.js 12.

## Related

*   [`retext-contractions`](https://github.com/retextjs/retext-contractions)
    — check apostrophe use in contractions
*   [`retext-diacritics`](https://github.com/retextjs/retext-diacritics)
    — check for proper use of diacritics
*   [`retext-quotes`](https://github.com/retextjs/retext-quotes)
    — check quote and apostrophe usage

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

[size-badge]: https://img.shields.io/bundlejs/size/retext-sentence-spacing

[size]: https://bundlejs.com/?q=retext-sentence-spacing

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/main/contributing.md

[support]: https://github.com/retextjs/.github/blob/main/support.md

[coc]: https://github.com/retextjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[unified]: https://github.com/unifiedjs/unified

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[vfile-message]: https://github.com/vfile/vfile-message

[api-options]: #options

[api-retext-sentence-spacing]: #unifieduseretextsentencespacing-options
