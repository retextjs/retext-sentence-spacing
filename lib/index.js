/**
 * @typedef {import('nlcst').Root} Root
 *
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {'double-space' | 'newline' | 'space' | 0 | 1 | 2 | null | undefined} [preferred='space']
 *   Spaces between sentences (default: `'space'`).
 */

import {toString} from 'nlcst-to-string'
import {visit} from 'unist-util-visit'

/** @type {Readonly<Options>} */
const emptyOptions = {}

/**
 * Ccheck spacing between sentences.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function retextSentenceSpacing(options) {
  const settings = options || emptyOptions
  const expected =
    settings.preferred === 'double-space' || settings.preferred === 2
      ? 2
      : settings.preferred === 'newline' || settings.preferred === 0
      ? 0
      : 1

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    visit(tree, 'ParagraphNode', function (node) {
      let index = -1

      while (++index < node.children.length) {
        const previous = node.children[index - 1]
        const child = node.children[index]
        const next = node.children[index + 1]

        if (
          !previous ||
          previous.type !== 'SentenceNode' ||
          child.type !== 'WhiteSpaceNode' ||
          !next ||
          next.type !== 'SentenceNode'
        ) {
          continue
        }

        const value = toString(child)

        // We only check for whitespace that is *just* spaces: it’s OK to add
        // line feeds if `space` is expected.
        if (!/^ +$/.test(value)) {
          continue
        }

        const actual = value.length

        // `actual` is never `expected` if we want a line feed.
        if (actual === expected) {
          continue
        }

        const message = file.message(
          expected === 0
            ? 'Unexpected spaces between sentence, expected a line ending'
            : 'Unexpected ' +
                actual +
                ' space' +
                (actual === 1 ? '' : 's') +
                ' between sentence, expected ' +
                expected +
                ' space' +
                (expected === 1 ? '' : 's'),
          {
            ancestors: [node, child],
            place: child.position,
            ruleId:
              expected === 0
                ? 'newline'
                : expected === 1
                ? 'space'
                : 'double-space',
            source: 'retext-sentence-spacing'
          }
        )

        message.actual = value
        message.expected = [expected === 0 ? '\n' : expected === 1 ? ' ' : '  ']
        message.url =
          'https://github.com/retextjs/retext-sentence-spacing#readme'
      }
    })
  }
}
