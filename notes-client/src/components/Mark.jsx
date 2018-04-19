import React from 'react'

const hightlightHash = children => {
  if (typeof children !== 'string') return children

  const parts = children.split(' ')
  if (!parts.length || parts.length < 2) return children

  return (
    <span>
      <span style={{
        fontSize: '1em',
        color: '#770000'
      }}>{parts[0]}</span>
    { ' ' + parts.slice(1).join(' ') }
    </span>
  )
}

export default props => {
  const {children, mark} = props
  switch (mark.type) {
    case 'bold':
      return <strong>{children}</strong>
    case 'code':
      return <code>{children}</code>
    case 'italic':
      return <em>{children}</em>
    case 'underlined':
      return <u>{children}</u>
    case 'h1':
      {
        return (<h1 style={{
            fontWeight: 'bold',
            fontSize: '2.5em',
            margin: '0.4em 0 0.2em 0',
            display: 'inline-block',
            borderBottom: '3px solid #ffffff',
            width: '30rem'
          }}>
          {hightlightHash(children)}
        </h1>)
      }
    case 'h2':
      {
        return (<h2 style={{
          fontWeight: 'bold',
          fontSize: '2.0em',
          margin: '0.35em 0 0.18em 0',
          display: 'inline-block',
          borderBottom: '1.5px solid #ffffff',
          width: '30rem'
          }}>
          {hightlightHash(children)}

        </h2>)
      }
    case 'h3':
      {
        return (<h3 style={{
          fontWeight: 'bold',
          fontSize: '1.5em',
          margin: '0.3em 0 0.15em 0',
          display: 'inline-block',
          borderBottom: '1px solid #aaaaaa',
          width: '30rem'
          }}>
          {hightlightHash(children)}

        </h3>)
      }
    case 'h4':
      {
        return (<h4 style={{
          fontWeight: 'bold',
          fontSize: '1em',
          margin: '0.2em 0 0.1em 0',
          display: 'inline-block',
          borderBottom: '0.7px solid #888888',
          width: '30rem'
          }}>
          {hightlightHash(children)}

        </h4>)
      }
    case 'punctuation':
      {
        return <span style={{
            opacity: 0.1
          }}>{children}</span>
      }
    case 'list':
      {
        return (<span style={{
            paddingLeft: '10px',
            lineHeight: '10px',
            fontSize: '20px'
          }}>
          {children}
        </span>)
      }
    case 'hr':
      {
        return (<span style={{
            borderBottom: '2px solid #ffffff',
            width: '30em',
            display: 'inline-block'
          }}>
          {children}
        </span>)
      }
  }
}
