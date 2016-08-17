# retext-sentence-spacing [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Check spacing (one or two spaces) between sentences with
[**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-sentence-spacing
```

## Usage

Dependencies.

```javascript
var retext = require('retext');
var spacing = require('retext-sentence-spacing');
var report = require('vfile-reporter');

retext().use(spacing).process([
  'One sentence. Two sentences.',
  '',
  'One sentence.  Two sentences.'
].join('\n'), function (err, file) {
  console.log(report(err || file));
});
```

Yields:

```text
  3:14-3:16  warning  Expected `1` space between sentences, not `2`

⚠ 1 warning
```

This plugin can be configured to prefer 2 spaces instead:

```diff
-retext().use(spacing).process([
+retext().use(spacing, {preferred: 2}).process([
   'One sentence. Two sentences.',
```

Yields:

```text
  1:14-1:15  warning  Expected `2` spaces between sentences, not `1`

⚠ 1 warning
```

## API

### `retext().use(sentenceSpacing[, options])`

Emit warnings when the spacing between two sentences does not adhere
to the preferred style.

###### `options`

*   `preferred` (`1` or `2`, default: `1`) — Number of expected spaces.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-sentence-spacing.svg

[travis]: https://travis-ci.org/wooorm/retext-sentence-spacing

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-sentence-spacing.svg

[codecov]: https://codecov.io/github/wooorm/retext-sentence-spacing

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext-sentence-spacing
