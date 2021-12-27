/**
 * @typedef {import('nlcst').Root} Root
 *
 * @typedef {0|1|2|'newline'|'space'|'double-space'|null|undefined} Preferred
 *
 * @typedef Options
 *   Configuration.
 * @property {Preferred} [preferred=1]
 *   Spaces between sentences.
 *   Use `0` for line endings.
 */

import {toString} from 'nlcst-to-string'
import {visit} from 'unist-util-visit'
import {convert} from 'unist-util-is'

const sentence = convert('SentenceNode')
const whiteSpace = convert('WhiteSpaceNode')

const source = 'retext-sentence-spacing'
const url = 'https://github.com/retextjs/retext-sentence-spacing#readme'

/**
 * Plugin to check spacing between sentences.
 * Emit warnings when the spacing does not adhere to the preferred style.
 *
 * @type {import('unified').Plugin<[Options?], Root>}
 */
export default function retextSentenceSpacing(options = {}) {
  let preferred = options.preferred

  if (preferred === 'newline') {
    preferred = 0
  }

  if (preferred === null || preferred === undefined || preferred === 'space') {
    preferred = 1
  }

  if (preferred === 'double-space') {
    preferred = 2
  }

  if (typeof preferred !== 'number') {
    throw new TypeError(
      "Expected `options.preferred` to be `'space'`, `'newline'`, or a `number`"
    )
  }

  if (preferred < 0 || preferred > 2) {
    throw new Error(
      "Expected `options.preferred` to be `'space'`, `'newline'`, or a `number` between (including) `0` and `2`"
    )
  }

  return (tree, file) => {
    visit(tree, 'ParagraphNode', (node) => {
      let index = -1

      while (++index < node.children.length) {
        const child = node.children[index]

        if (
          !sentence(node.children[index - 1]) ||
          !whiteSpace(child) ||
          !sentence(node.children[index + 1])
        ) {
          continue
        }

        const actual = toString(child)

        // We only check for whitespace that is *just* spaces: it’s OK to add
        // line feeds if `space` is expected.
        if (!/^ +$/.test(actual)) {
          continue
        }

        const size = actual.length
        /** @type {string} */
        let reason

        // Size is never preferred if we want a line feed.
        if (preferred === 0) {
          reason =
            'Expected a newline between sentences, not `' +
            size +
            '` space' +
            (size === 1 ? '' : 's')
        } else if (size === preferred) {
          continue
        } else {
          reason =
            'Expected `' +
            preferred +
            '` space' +
            (preferred === 1 ? '' : 's') +
            ' between sentences, not `' +
            size +
            '`'
        }

        Object.assign(
          file.message(
            reason,
            child,
            [
              source,
              preferred === 0
                ? 'newline'
                : preferred === 1
                ? 'space'
                : 'double-space'
            ].join(':')
          ),
          {
            actual,
            expected: [preferred === 0 ? '\n' : preferred === 1 ? ' ' : '  '],
            url
          }
        )
      }
    })
  }
}
