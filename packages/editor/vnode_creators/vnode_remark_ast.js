var unified = require('unified')
var createStream = require('unified-stream')
var markdown = require('remark-parse')
var html = require('remark-html')

var processor = unified()
  .use(markdown, {commonmark: true})

const vnode = ast => {
  console.log(ast)
  return ast
}

const parse = text =>

export default text => vnode(md.parse(text, {}))
