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
  const preferred =
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

        const message = file.message(reason, {
          place: child.position,
          ruleId:
            preferred === 0
              ? 'newline'
              : preferred === 1
              ? 'space'
              : 'double-space',
          source: 'retext-sentence-spacing'
        })

        message.actual = actual
        message.expected = [
          preferred === 0 ? '\n' : preferred === 1 ? ' ' : '  '
        ]
        message.url =
          'https://github.com/retextjs/retext-sentence-spacing#readme'
      }
    })
  }
}
