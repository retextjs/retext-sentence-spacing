import {toString} from 'nlcst-to-string'
import {visit} from 'unist-util-visit'
import {convert} from 'unist-util-is'

const sentence = convert('SentenceNode')
const whiteSpace = convert('WhiteSpaceNode')

const source = 'retext-sentence-spacing'
const ids = ['newline', 'space', 'double-space']
const expected = ['\n', ' ', '  ']

export default function retextSentenceSpacing(options) {
  let preferred = (options || {}).preferred

  if (preferred === null || preferred === undefined || preferred === 'space') {
    preferred = 1
  }

  if (preferred === 'newline') {
    preferred = 0
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

  return transformer

  function transformer(tree, file) {
    visit(tree, 'ParagraphNode', visitor)

    function visitor(node) {
      const children = node.children
      const length = children.length
      let index = 0
      let reason
      let message
      let actual
      let child
      let size

      while (++index < length) {
        child = children[index]

        if (
          !sentence(children[index - 1]) ||
          !whiteSpace(child) ||
          !sentence(children[index + 1])
        ) {
          continue
        }

        actual = toString(child)

        // We only check for white-space that is *just* spaces: it’s OK to add
        // line feeds if `space` is expected.
        if (!/^ +$/.test(actual)) {
          continue
        }

        size = actual.length

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

        message = file.message(
          reason,
          child,
          [source, ids[preferred]].join(':')
        )

        message.actual = actual
        message.expected = [expected[preferred]]
      }
    }
  }
}
