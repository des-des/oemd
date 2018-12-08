import React from 'react'

import getCursorAtOffset from '../utils/get_cursor_at_offset'

export default (opts = {}) => {
  return {
    type: 'title',
    decorations: node => {
      const level = node.data.get('level')
      const textNodes = node.getTexts()

      const anchorOffset = 0;
      const anchorKey = textNodes.first().key

      const {
        offset: focusOffset,
        key: focusKey
      } = getCursorAtOffset(node, level)

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
      switch (node.data.get('level')) {
        case 1: {
          return (
            <h1 className='title title__level-1' {...props.attributes}>
              {props.children}
            </h1>
          )
        }
        case 2: {
          return (
            <h2 className='title title__level-2' {...props.attributes}>
              {props.children}
            </h2>
          )
        }
        case 3: {
          return (
            <h3 className='title title__level-3' {...props.attributes}>
              {props.children}
            </h3>
          )
        }
        case 4: {
          return (
            <h4 className='title title__level-4' {...props.attributes}>
              {props.children}
            </h4>
          )
        }
      }
    },
    onKeyDown: (event, change) => {
      const { value } = change
      const block = value.startBlock

      if (block.type === 'line') {
        if (event.key === ' ') {
          const withSpace = block.text + ' '
          if (withSpace.match(/(^#+)\ +/)) {
            const level = withSpace.split(' ')[0].length
            change.setBlocks({ type: 'title', data: { level }})
            
            return true;
          }
        }
      }

      if (block.type === 'title') {
        if (event.key === 'Enter') {
          change.splitBlock().setBlocks('line')

          return false;
        }
      }

      return true
    }
  }
}
