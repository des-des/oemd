import React from 'react'

import getCursorAtOffset from '../utils/get_cursor_at_offset'

export default (opts = {}) => {
  return {
    type: 'list-item',
    decorations: node => {
      const {
        key: anchorKey,
        offset: anchorOffset
      } = getCursorAtOffset(node, 2)

      const {
        key: focusKey,
        offset: focusOffset
      } = getCursorAtOffset(node, 3)

      return [{
        anchorKey,
        anchorOffset,
        focusKey,
        focusOffset,
        marks: [{
          type: 'punctuation'
        }]
      }]
    },
    render: props => {
      const { node } = props

      return (
        <li className='list-item'> { props.children } </li>
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
            const level = withSpace.split(' ')[0].length
            change
              .setBlock('list-item')
              .wrapBlock('list')
          }
        }
      }

      if (block.type === 'list-item') {
        if (event.key === 'Enter') {
          if (block.text === '  * ') {
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
            .insertText('  * ')

          event.preventDefault()
          return false;
        }
      }
    }
  }
}
