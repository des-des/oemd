import React from 'react'

export default (opts = {}) => ({
  type: 'punctuation',
  render: props => {
    return (
      <span className='punctuation'>{props.children}</span>
    )
  }
})
