import { h } from './snabbdom.js'

const isElement = e => typeof e === 'string' || Array.isArray(e)

// const parseElement = e => {
//   console.log({ e })
//   if (typeof e === 'string') return e
//
//   const tagName = e[0]
//
//   if (e.length === 1) return h(tagName, {}, [])
//
//   if (isElement(e[1])) {
//     console.log('No Attribute branch');
//     const rest = e.slice(1)
//     console.log({ rest });
//     const children = rest.map(parseElement)
//     return h(tagName, {}, rest.map(parseElement))
//   }
//
//   const attributes = e[1]
//   const rem = e.slice(2)
//   const children = rem.map(parseElement)
//   // console.log({ e, rem, children })
//
//   return h(tagName, attributes, children)
// }
//
const elemToSnabbdom = (tagName, attributes, children) => {
  switch ( tagName ) {
    case 'header':
      const { level, ...attrs } = attributes
      return { tagName: `h${level}`, attributes: attrs };
    case 'bulletlist':
      return { tagName: 'ul', attributes };
    case 'numberlist':
      return { tagName: 'ol', attributes };
    case 'listitem':
      return { tagName: 'li', attributes };
    case 'para':
      return { tagName: 'p', attributes };
    case 'markdown':
      // This is the editor element
      return {
        tagName: 'div#editor',
        attributes: {
          contenteditable: true
        }
      }
    default:
      return { tagName, attributes }
  }

}
    // case 'code_block':
    //   jsonml[ 0 ] = 'pre';
    //   i = attrs ? 2 : 1;
    //   var code = [ 'code' ];
    //   code.push.apply( code, jsonml.splice( i, jsonml.length - i ) );
    //   jsonml[ i ] = code;
    //   break;
    // case 'inlinecode':
    //   jsonml[ 0 ] = 'code';
    //   break;
    // case 'img':
    //   jsonml[ 1 ].src = jsonml[ 1 ].href;
    //   delete jsonml[ 1 ].href;
    //   break;
    // case 'linebreak':
    //   jsonml[ 0 ] = 'br';
    //   break;
    // case 'link':
    //   jsonml[ 0 ] = 'a';
    //   break;
    // case 'link_ref':
    //   jsonml[ 0 ] = 'a';
    //
    //   // grab this ref and clean up the attribute node
    //   var ref = references[ attrs.ref ];
    //
    //   // if the reference exists, make the link
    //   if ( ref ) {
    //     delete attrs.ref;
    //
    //     // add in the href and title, if present
    //     attrs.href = ref.href;
    //     if ( ref.title )
    //       attrs.title = ref.title;
    //
    //     // get rid of the unneeded original text
    //     delete attrs.original;
    //   }
    //   // the reference doesn't exist, so revert to plain text
    //   else {
    //     return attrs.original;
    //   }
    //   break;
    // case 'img_ref':
    //   jsonml[ 0 ] = 'img';
    //
    //   // grab this ref and clean up the attribute node
    //   var ref = references[ attrs.ref ];
    //
    //   // if the reference exists, make the link
    //   if ( ref ) {
    //     delete attrs.ref;
    //
    //     // add in the href and title, if present
    //     attrs.src = ref.href;
    //     if ( ref.title )
    //       attrs.title = ref.title;
    //
    //     // get rid of the unneeded original text
    //     delete attrs.original;
    //   }
    //   // the reference doesn't exist, so revert to plain text
    //   else {
    //     return attrs.original;
    //   }
    //   break;
    // }

const parseElement = e => {
  if (typeof e === 'string') return e

  const tagName = e[0]
  let attributes, restElements

  if (e.length === 1) {
    attributes = {}
    restElements = []
  } else if (isElement(e[1])) {
    attributes = {}
    restElements = e.slice(1)
  } else {
    attributes = e[1]
    restElements = e.slice(2)
  }

  const children = restElements.map(parseElement)
  console.log({ tagName, attributes });
  const { attributes: attrs, tagName: tag } = elemToSnabbdom(tagName, attributes)
  return h(tag, { props: attrs }, children)
}


export default parseElement

//element
//  = '[' tag-name ',' attributes ',' element-list ']'
//    | '[' tag-name ',' attributes ']'
//    | '[' tag-name ',' element-list ']'
//  | '[' tag-name ']'
//    | string
//    ;

// tag-name
//     = string
//     ;
// attributes
//     = '{' attribute-list '}'
//     | '{' '}'
//     ;
// attribute-list
//     = attribute ',' attribute-list
//     | attribute
//     ;
// attribute
//     = attribute-name ':' attribute-value
//     ;
// attribute-name
//     = string
//     ;
// attribute-value
//     = string
//     | number
//     | 'true'
//     | 'false'
//     | 'null'
//     ;
// element-list
//     = element ',' element-list
//     | element
//     ;
