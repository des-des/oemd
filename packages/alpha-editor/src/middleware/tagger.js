import MarkdownIt from 'markdown-it'

import {
  EDIT_NOTE
} from '../constants/action_types'

// const getChildren = node => node.nodes

const decend = fn => {
  const rec = tree => {
    fn(tree)
//     getChildren(tree).forEach(rec)
//   }
//
//   return rec
// }
// // [
// //   {
// //     "type": "heading_open",
// //     "tag": "h1",
// //     "attrs": null,
//     "map": [
//       0,
//       1
//     ],
//     "nesting": 1,
//     "level": 0,
//     "children": null,
//     "content": "",
//     "markup": "#",
//     "info": "",
//     "meta": null,
//     "block": true,
//     "hidden": false
//   },
//   {
//     "type": "inline",
//     "tag": "",
//     "attrs": null,
//     "map": [
//       0,
//       1
//     ],
//     "nesting": 0,
//     "level": 1,
//     "children": [
//       {
//         "type": "text",
//         "tag": "",
//         "attrs": null,
//         "map": null,
//         "nesting": 0,
//         "level": 0,
//         "children": null,
//         "content": "This is ",
//         "markup": "",
//         "info": "",
//         "meta": null,
//         "block": false,
//         "hidden": false
//       },
//       {
//         "type": "strong_open",
//         "tag": "strong",
//         "attrs": null,
//         "map": null,
//         "nesting": 1,
//         "level": 1,
//         "children": null,
//         "content": "",
//         "markup": "**",
//         "info": "",
//         "meta": null,
//         "block": false,
//         "hidden": false
//       },
//       {
//         "type": "text",
//         "tag": "",
//         "attrs": null,
//         "map": null,
//         "nesting": 0,
//         "level": 1,
//         "children": null,
//         "content": "cool",
//         "markup": "",
//         "info": "",
//         "meta": null,
//         "block": false,
//         "hidden": false
//       },
//       {
//         "type": "strong_close",
//         "tag": "strong",
//         "attrs": null,
//         "map": null,
//         "nesting": -1,
//         "level": 0,
//         "children": null,
//         "content": "",
//         "markup": "**",
//         "info": "",
//         "meta": null,
//         "block": false,
//         "hidden": false
//       },
//       {
//         "type": "text",
//         "tag": "",
//         "attrs": null,
//         "map": null,
//         "nesting": 0,
//         "level": 0,
//         "children": null,
//         "content": "",
//         "markup": "",
//         "info": "",
//         "meta": null,
//         "block": false,
//         "hidden": false
//       }
//     ],
//     "content": "This is **cool**",
//     "markup": "",
//     "info": "",
//     "meta": null,
//     "block": true,
//     "hidden": false
//   },
//   {
//     "type": "heading_close",
//     "tag": "h1",
//     "attrs": null,
//     "map": null,
//     "nesting": -1,
//     "level": 0,
//     "children": null,
//     "content": "",
//     "markup": "#",
//     "info": "",
//     "meta": null,
//     "block": true,
//     "hidden": false
//   }
// ]

// const getChildren = (tokens, parentType) => {
//   console.log({ tokens });
//   const children = []
//   let tokensRemaining = tokens
//   while (tokensRemaining.length !== 0) {
//     console.log({tokensRemaining});
//     const nextToken = tokensRemaining[0]
//     if ((/_open/).test(nextToken.type)) {
//       const index = nextToken.type.search(/_open/)
//       const tagName = nextToken.type.slice(0, index)
//
//       const {
//         tokensRemaining: newTokensRemaining,
//         children: newChildren
//       } = getChildren(tokensRemaining.slice(1), tagName)
//
//       children.push({
//         type: tagName,
//         children: newChildren
//       })
//
//       tokensRemaining = newTokensRemaining
//       continue;
//     }
//
//     if (nextToken.type === `${parentType}_close`) {
//       return {
//         tokensRemaining: tokensRemaining.slice(1),
//         children
//       }
//     }
//
//     if (nextToken.type === 'inline') {
//       children.push(getChildren(nextToken.children, parentType))
//       tokensRemaining = tokensRemaining.slice(1)
//       continue
//     }
//
//     children.push(tokensRemaining[0])
//     tokensRemaining = tokensRemaining.slice(1)
//   }
//
//   return {
//     tokensRemaining,
//     children
//   }
}

const md = new MarkdownIt();
// PrevParseTree, text

const tagger = decend(node => {})


export default store => {
  const cache = {}

  return next => action => {
    if (action.type !== EDIT_NOTE) return next(action)

    const { payload: value } = action

    const { notes } = store.getState()
    const { activeNoteId } = notes
    const { notesById: { [activeNoteId]: { value: oldValue } } } = notes

    // oldValue.document.nodes
    //   .zip(value.document.nodes)
    //   .forEach(([oldNode, newNode]) => {
    //     if (oldNode !== newNode) {
    //       const parseTree = md.parse(newNode.text)
    //       console.log('Change found!');
    //       console.log(parseTree)
    //       console.log(getChildren(parseTree, 'root'));
    //     }
    //   })
    // console.log('#################');
    console.log(value.toJSON())

    next(action)
  }

}
