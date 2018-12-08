import React from 'react'
import { Range } from 'slate'

import punctuateAt from '../utils/punctuate_at'

export default (opts = {}) => {
  return {
    type: 'list-item',
    render: props => {
      const { node } = props

      return (
        <li className='list-item' {...props.attributes}> { props.children } </li>
      )
    },
    onKeyDown: (event, change) => {
      const { value } = change
      if (value.isExpanded) return

      const block = value.startBlock

      if (block.type === 'line') {
        if (event.key === ' ') {
          const withSpace = block.text + ' '
          if (withSpace.match(/(^  \*)\ +/)) {
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
