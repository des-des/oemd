import Prism from 'prismjs'

/**
 * Add the markdown syntax to Prism.
 */
 // 'use strict'

// eslint-disable-next-line;
Prism.languages.markdown = Prism.languages.extend("markup", {}),
Prism.languages.insertBefore("markdown", "prolog", {
  blockquote: {
    pattern: /^>(?:[\t ]*>)*/m,
    alias: "punctuation"
  },
  code: [
    {
      pattern: /^(?: {4}|\t).+/m,
      alias: "keyword"
    }, {
      pattern: /``.+?``|`[^`\n]+`/,
      alias: "keyword"
    }
  ],
  h4: /(^\s*)####.*/m,
  h3: /(^\s*)###.*/m,
  h2: {
    pattern: /(^\s*)##.*/m,
    inside: {
      punctuation: /^#+|#+$/
    }
  },
  h1: {
    pattern: /(^\s*)#.*/m,
    inside: {
      punctuation: /^#+|#+$/
    }
  },
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)\w*/m,
    lookbehind: !0,
    alias: "punctuation"
  },
  list: {
    pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
    lookbehind: !0,
    alias: "punctuation"
  },
  "url-reference": {
    pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
    inside: {
      variable: {
        pattern: /^(!?\[)[^\]]+/,
        lookbehind: !0
      },
      string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
      punctuation: /^[\[\]!:]|[<>]/
    },
    alias: "url"
  },
  bold: {
    pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: {
      punctuation: /^\*\*|^__|\*\*$|__$/
    }
  },
  italic: {
    pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: {
      punctuation: /^[*_]|[*_]$/
    }
  },
  url: {
    pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      variable: {
        pattern: /(!?\[)[^\]]+(?=\]$)/,
        lookbehind: !0
      },
      string: {
        pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
      }
    }
  }
}),
Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url),
Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url),
Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic),
Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore
Prism.languages.markdown.h1.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);

const tokenise = string => {
  return Prism.tokenize(string, Prism.languages.markdown)
}
//
// const decorateNode = node => {
//   if (node.object != 'block')
//     return
//
//   const string = node.text
//   const texts = node.getTexts().toArray()
//   const tokens = tokenise(string)
//   const decorations = []
//   let startText = texts.shift()
//   let endText = startText
//   let startOffset = 0
//   let endOffset = 0
//   let start = 0
//
//   function getLength(token) {
//     if (typeof token == 'string') {
//       return token.length
//     } else if (typeof token.content == 'string') {
//       return token.content.length
//     } else {
//       return token.content.reduce((l, t) => l + getLength(t), 0)
//     }
//   }
//
//   for (const token of tokens) {
//     startText = endText
//     startOffset = endOffset
//
//     const length = getLength(token)
//     const end = start + length
//
//     let available = startText.text.length - startOffset
//     let remaining = length
//
//     endOffset = startOffset + remaining
//
//     while (available < remaining) {
//       endText = texts.shift()
//       remaining = length - available
//       available = endText.text.length
//       endOffset = remaining
//     }
//
//     if (typeof token != 'string') {
//       const range = {
//         anchorKey: startText.key,
//         anchorOffset: startOffset,
//         focusKey: endText.key,
//         focusOffset: endOffset,
//         marks: [
//           {
//             type: token.type
//           }
//         ]
//       }
//
//       decorations.push(range)
//     }
//
//     start = end
//   }
//
//   return decorations
// }

const decorateNode = node => {
  // console.log('decorateNode called');
  if (node.object != 'block')
    return

  const string = node.text
  const texts = node.getTexts()
  console.log({ texts: texts.toJS() })
  const tokens = tokenise(string)


  const keyOffsets = texts.reduce(({ offsets, lastEndOffset }, textNode) => {
    const nextEndOffset = lastEndOffset + textNode.text.length
    // console.log({ nextEndOffset });
    return {
      offsets: offsets.concat({
        nodeStartOffset: lastEndOffset,
        nodeEndOffset: nextEndOffset,
        nodeKey: textNode.key
      }),
      lastEndOffset: nextEndOffset
    }
  }, { lastEndOffset: 0, offsets: [] }).offsets

  const getPos = totalOffset => {

    const result = keyOffsets.reduce((result, currentNode) => {
      // console.log('getPos', );
      if (result) return result

      const { nodeStartOffset, nodeEndOffset, nodeKey } = currentNode
      if (totalOffset <= nodeEndOffset) {
        return {
          key: nodeKey,
          offset: totalOffset - nodeStartOffset
        }
      }

      return false
    }, false)
    return result
  }

  const getTokenLength = token => {
    if (typeof token === 'string') return token.length
    if (typeof token.content === 'string') return token.content.length

    return token.content.reduce((len, token) => len + getTokenLength(token), 0)
  }

  const getDecorations = (tokens, prevOffset = 0, decorations = []) => {
    console.log(JSON.stringify(tokens, null, 4));
    const [token, ...rest] = tokens
    if (token === undefined) return decorations
    const tokenLength = getTokenLength(token)
    const startOffset = prevOffset
    const nextOffset = prevOffset + tokenLength


    if (typeof token === 'string') {
      return getDecorations(rest, nextOffset, decorations)
    }

    const { key: anchorKey, offset: anchorOffset } = getPos(startOffset)
    const { key: focusKey, offset: focusOffset } = getPos(nextOffset)

    const newDecoration =  {
      anchorKey,
      anchorOffset,
      focusKey,
      focusOffset,
      marks: [
        {
          type: token.type
        }
      ]
    }

    if (typeof token.content === 'string') {
      return getDecorations(rest, nextOffset, decorations.concat(newDecoration))
    }

    const innerDecorations = getDecorations(token.content, startOffset)

    return getDecorations(
      rest,
      nextOffset,
      decorations.concat(newDecoration, innerDecorations)
    )
  }

  return getDecorations(tokens)
}


export default node => {
  const decorations = decorateNode(node)

  console.log(JSON.stringify(decorations, null, 4))
  return decorations
}
