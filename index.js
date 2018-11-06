'use strict'

var toString = require('nlcst-to-string')
var visit = require('unist-util-visit')
var is = require('unist-util-is')
var plural = require('plur')

module.exports = sentenceSpacing

function sentenceSpacing(options) {
  var preferred = (options || {}).preferred || 1

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
      var message

      while (++index < length) {
        child = children[index]

        if (
          is('SentenceNode', children[index - 1]) &&
          is('WhiteSpaceNode', child) &&
          is('SentenceNode', children[index + 1])
        ) {
          value = toString(child)

          /* Ignore anything with non-spaces. */
          if (!/^ +$/.test(value)) {
            continue
          }

          size = value.length

          if (size !== preferred) {
            message = file.warn(
              'Expected `' +
                preferred +
                '` ' +
                plural('space', preferred) +
                ' between ' +
                'sentences, not `' +
                size +
                '`',
              child
            )

            message.source = 'retext-sentence-spacing'
            message.ruleId = 'retext-sentence-spacing'
          }
        }
      }
    }
  }
}
