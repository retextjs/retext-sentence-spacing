'use strict'

var toString = require('nlcst-to-string')
var visit = require('unist-util-visit')
var convert = require('unist-util-is/convert')
var plural = require('plur')

module.exports = sentenceSpacing

var sentence = convert('SentenceNode')
var whiteSpace = convert('WhiteSpaceNode')

var id = 'retext-sentence-spacing:retext-sentence-spacing'

function sentenceSpacing(options) {
  var preferred = (options || {}).preferred

  if (preferred === null || preferred === undefined || preferred === 'space') {
    preferred = 1
  }

  if (preferred === 'newline') {
    preferred = 0
  }

  if (typeof preferred !== 'number') {
    throw new Error(
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
      var children = node.children
      var length = children.length
      var index = 0
      var value
      var child
      var size

      while (++index < length) {
        child = children[index]

        if (
          !sentence(children[index - 1]) ||
          !whiteSpace(child) ||
          !sentence(children[index + 1])
        ) {
          continue
        }

        value = toString(child)

        // We only check for white-space that is *just* spaces: it’s OK to add
        // line feeds if `space` is expected.
        if (!/^ +$/.test(value)) {
          continue
        }

        size = value.length

        // Size is never preferred if we want a line feed.
        if (preferred === 0) {
          file.warn(
            'Expected a newline between sentences, not `' +
              size +
              '` ' +
              plural('space', size),
            child,
            id
          )
        } else if (size !== preferred) {
          file.warn(
            'Expected `' +
              preferred +
              '` ' +
              plural('space', preferred) +
              ' between sentences, not `' +
              size +
              '`',
            child,
            id
          )
        }
      }
    }
  }
}
