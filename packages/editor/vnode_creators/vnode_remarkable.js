const Remarkable = require('remarkable');
const md = new Remarkable();

const vnode = ast => {
  console.log(ast)
  return ast
}

export default text => vnode(md.parse(text, {}))
