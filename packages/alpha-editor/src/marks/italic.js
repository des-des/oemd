import React from 'react'
import {
  Range
} from 'slate'

import getCursorAtOffset from '../utils/get_cursor_at_offset'
import punctuateAt from '../utils/punctuate_at'
//
// ;
//   blockquote: {
//     pattern: /^>(?:[\t ]*>)*/m,
//     alias: "punctuation"
//   },
//   code: [{
//     pattern: /^(?: {4}|\t).+/m,
//     alias: "keyword"
//   }, {
//     pattern: /``.+?``|`[^`\n]+`/,
//     alias: "keyword"
//   }],
//   title: [{
//     pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
//     alias: "important",
//     inside: {
//       punctuation: /==+$|--+$/
//     }
//   }, {
//     pattern: /(^\s*)#+.+/m,
//     lookbehind: !0,
//     alias: "important",
//     inside: {
//       punctuation: /^#+|#+$/
//     }
//   }],
//   hr: {
//     pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
//     lookbehind: !0,
//     alias: "punctuation"
//   },
//   list: {
//     pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
//     lookbehind: !0,
//     alias: "punctuation"
//   },
//   "url-reference": {
//     pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
//     inside: {
//       variable: {
//         pattern: /^(!?\[)[^\]]+/,
//         lookbehind: !0
//       },
//       string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
//       punctuation: /^[\[\]!:]|[<>]/
//     },
//     alias: "url"
//   },
//   bold: {
//     pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
//     pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
//     lookbehind: !0,
//     inside: {
//       punctuation: /^\*\*|^__|\*\*$|__$/
//     }
//   },
//   italic: {
//     lookbehind: !0,
//     inside: {
//       punctuation: /^[*_]|[*_]$/
//     }
//   },
//   url: {
//     pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
//     inside: {
//       variable: {
//         pattern: /(!?\[)[^\]]+(?=\]$)/,
//         lookbehind: !0
//       },
//       string: {
//         pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
//       }
//     }
//   }
// }), Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic), Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore
//

export default (opts = {}) => {
  return {
    type: 'list-item',
    render: props => {
      const {
        node
      } = props

      return ( <
        i { ...props.attributes
        } > {
          props.children
        } < /i>
      )
    },
    onKeyDown: (event, change) => {
      const {
        value
      } = change
      if (value.isExpanded) return

      const block = value.startBlock

      // if (block.type === 'line') {
      if (event.key === '_') {
        const withSpace = block.text + ' '
        if (block.text.match(/_(.[^_])+_/)) {
          change
            .setBlocks('list-item')
            .wrapBlock('list')
            .insertText(' ')
            .call(punctuateAt(2, block.key))

          return false;
        }
      }
    }

    if (block.type === 'list-item') {
      if (event.key === 'Enter') {
        if (block.text === '  *  ') {
          change
            .deleteBackward(4)
            .unwrapBlock()
            .setBlock('line')

          return false;
        }

        change
          .splitBlock()
          .setBlock({
            type: 'list-item'
          })
          .insertText('  *  ')

        const newBlock = change.value.document.getNextBlock(block.key)

        change.call(punctuateAt(2, newBlock.key))

        event.preventDefault()
        return false;
      }
    }
  }
}
}
