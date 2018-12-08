import React from 'react'
import Html from 'slate-html-serializer'

import { list, listItem, title } from '../blocks/'
import { punctuation } from '../marks/'

const rules = [list(), listItem(), title(), punctuation()].map(block => ({
  serialize: (node, children) => {
    console.log({ nodeType: node.type, ruleType: block.type });
    if (block.type === node.type) {
      return block.render({ node, children })
    }

    if (node.type === 'line') {
      return <p> { children } </p>
    }
  }
}))

const html = new Html({
  rules,
  defaultBlock: ''
})

export default html
