const MarkdownIt = require('markdown-it')

const md = new MarkdownIt()

const eat = tokens => {
  const tags = []
  let children = []
  let childStack = []

  for (let i = 0; i < tokens.length; i++) {
    const top = tags[tags.length - 1]
    const token = tokens[i]

    // console.log(
    //   JSON.stringify(
    //     {
    //       children,
    //       childStack,
    //       token,
    //       i,
    //       top
    //     },
    //     null,
    //     4
    //   )
    // )

    let tokenType
    let tokenModifer

    const tokenParts = token.type.split('_')
    if (tokenParts.length === 1) {
      tokenType = token.type
    } else {
      tokenType = tokenParts.slice(0, tokenParts.length - 1).join('_')
      tokenModifer = tokenParts[tokenParts.length - 1]
    }

    if (tokenModifer === 'open') {
      tags.push(tokenType)
      childStack.push(children)
      children = []
      if (tokenType === 'heading') {
        children.push({ tag: 'text', attrs: {}, children: token.markup + ' ' })
      } else {
        children.push({ tag: 'text', attrs: {}, children: token.markup })
      }
      continue
    }
    if (tokenModifer === 'close') {
      tags.pop
      if (tokenType !== 'heading') {
        children.push({ tag: 'text', attrs: {}, children: token.markup })
      }
      const newNode = { tag: token.tag, attrs: {}, children }
      children = childStack.pop()
      children.push(newNode)
      continue
    }

    if (tokenType === 'text') {
      children.push({ tag: 'text', attrs: {}, children: token.content })
      continue
    }

    if (token.block) {
      children.push(...eat(token.children))
      continue
    }
  }

  return children
}

const vnode = ast => {
  const out = eat(ast)
  return eat(ast)
}

export default text => {
  return vnode(md.parse(text, {}))
}
