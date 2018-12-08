const MarkdownIt = require('markdown-it')

const md = new MarkdownIt()

const vnode = ast => {
  console.log(ast)
  return ast
}

export default text => vnode(md.parse(text, {}))
