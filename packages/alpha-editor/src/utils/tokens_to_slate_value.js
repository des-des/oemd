import tokenise from './tokenise'

const block = ({ type='line', isVoid=false, data={}, nodes=[] }) => ({
  object: 'block',
  type,
  nodes,
  isVoid,
  data
})

const inlineNode = ({ type='line', nodes=[], isVoid=false, data={} }) => ({
  object: 'inline',
  type,
  nodes,
  isVoid,
  data
})

const textNode = text => ({
  object: 'text',
  leaves: [{
    object: 'leaf',
    text,
    marks: []
  }]
})

const tokensToSlateJson = tokens => {
  if (typeof tokens === 'string') return textNode(tokens)

  return tokens.reduce((slateJson, token) => {
    // console.log({ token, slateJson })
    const content = token.content

    if (typeof token === 'string') return slateJson.concat(textNode(token))
    if (typeof token.content === 'string') return slateJson.concat(textNode(content))

    const node = inlineNode({
      type: token.type,
      nodes: tokensToSlateJson(content)
    })

    return slateJson.concat(node)
  }, [])
}

export default text => {

  const tokens = tokenise(text)

  return block({
    nodes: tokensToSlateJson(tokens)
  })
}
