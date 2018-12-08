import React from 'react'

import getCursorAtOffset from '../utils/get_cursor_at_offset'

export default (opts = {}) => {
  return {
    type: 'list',
    render: props => {
      const { node } = props

      return (
        <ul className='list'> { props.children } </ul>
      )
    }
  }
}
