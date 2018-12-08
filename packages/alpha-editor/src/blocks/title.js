import React from 'react'

import punctuateAt from '../utils/punctuate_at'

export default (opts = {}) => {
  return {
    type: 'title',
    render: props => {
      const { node } = props
      console.log('RENDERING TITLE');
      console.log(node.data.get('level'));
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

      return <span> {props.children} </span>
    },
    onKeyDown: (event, change) => {
      const { value } = change
      const block = value.startBlock

      if (block.type === 'line') {
        if (event.key === ' ') {
          const withSpace = block.text + ' '
          if (withSpace.match(/(^#+)\ +/)) {
            const level = withSpace.split(' ')[0].length
            change
              .setBlocks({ type: 'title', data: { level }})
              .insertText(' ')
              .call(punctuateAt(0, block.key, level))

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
