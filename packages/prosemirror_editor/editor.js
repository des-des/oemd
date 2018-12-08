import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {exampleSetup} from "prosemirror-example-setup"

import parse from '../parser/parse.js'
import schema from './schema.js'

console.log('CAN I EVEN LOG SHIT');

// const mapTree = f => {
//   const mapper = tree => ({ ...f(tree), children: tree.children.map(mapper) })
//
//   return mapper
// }

/*
Okay I just realised something really dumb - the underlying data is pure text,
nothing special - which means crdt should be super easy to work with,
    - no fance trees to worry about, just a list of lists (lines, characters)
  1. Create basic model (list of lines)
  2. Implement CRDT
  3. Render

  this brings me back to the 2 directional mapping problem (editor model <> collab model), but this time the solution is easier?
  The crux of the problem is how cursors interact with changes.
  Cursors are easy to work with since they can be represented as orthoganal vectors
  The other half of the problem is that the editor model is immutable, which means we have to translate a diff set and cannot just overwrite
  We could do the parsing inside the render functions with memoisation? Hmmmmmmm, no prose needs dom tree to calc indexes - will not be allowed

  We come AGAIN to the problem of these editors not letting you define your own data model

  I think it is to do with the interactions of the cursors with the DOM
    - cursors are central to editing, each lib builds its own cursor thingy on top of thier own dom model

  The fundemental idea is WYSIWYG (i think) - we render the markdown EXACTLY

  Editor event -> text event (colab here) -> editor event
  How does prose implement (split block)

  okay final thought, let break ops into
  insert, and remove. We have a single linked list
  we have a single list
  Okay,

  panic over, we can do this with decorations - these do not modify the document - unlike slate these can be block level
  all we need to do is
    1. flatten the tree
    2. update the decorations intigently
      a. intercept the transaction
      b. grab the state
      c. Apply the transation
      d. diff the state to rebuild decorations inteligently!
      e as step one we can re


Hmm okay new idea -> we maintain 2 things woah woah 
*/

parseTreeToDecs = (parseTree) => {
    const { size, decs } = parseTree.children.reduce(({ decs, size }), elem => {
      const { size: elemSize, decs: elemDecs } = parseTreeToDecs(child)

      return {
        size: totalSize + elemSize,
        decs: allDecs.concat(elemDecs)
      }
    })

    return {
      size: size + 2,
      decs: decs.concat()
    }
}

let markdownPlugin = new Plugin({
  state: {
    init(_, {doc}) {
      const content = doc.content
      let decorations = []
      const parseTree = parse(newText)[0][0]

      for (let pos = 1; pos < doc.content.size; pos += 4)
        speckles.push(Decoration.inline(pos - 1, pos, {style: "background: yellow"}))
      return DecorationSet.create(doc, speckles)
    },
    apply(tr, set) { return set.map(tr.mapping, tr.doc) }
  },
  props: {
    decorations(state) { return specklePlugin.getState(state) }
  }
})

const buildProseModel = node => {
  console.log(node)
  if (node.tag === 'text') return schema.text(node.children)

  return schema.node(node.tag, node.attrs, node.children.map(buildProseModel))
}

window.view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
    // plugins: exampleSetup(schema)
  }),
  handleTextInput: (view, from, to, text) => {
    // We need a much more simple example
    // Inline a fa

    const doc = view.state.doc
    const block = doc.resolve(from).node(1)

    const pos = doc.resolve(from)
    const start = pos.start(1)
    const end = pos.end(1)

    const nodeFrom = from - start - 1;

    const blockIndex = doc.resolve(from).index(1)

    const updatedNode = view.state.tr
      .insertText(text, from, to)
      .doc
      .resolve(from)
      .node(1)

    // get the endpos of the last child
    // get the size
    const newText = '\n' + updatedNode.textContent

    // console.log('1 -> ####')
    // console.log(JSON.stringify(parse(newText), null, 4))

    // Hello **ProseMirror**
    console.log(parse(newText))
    const newBlock2 = buildProseModel(parse(newText)[0][0])
    // const newBlock = schema.node('paragraph', {}, [
    //   schema.text('Hello '),
    //   schema.node('bold', {}, schema.text('**ProseMirror**'))
    // ])
    // console.log(newBlock.sameMarkup(newBlock));
    // console.log(newBlock.sameMarkup(newBlock2));
    // console.log({newBlock2, newBlock})
    // console.log('2 -> ####')
    // console.log(JSON.stringify(block, null, 4))
    // console.log(JSON.stringify(newBlock, null, 4))

    // block.check()
    // console.log(newBlock.check())
    //
    //
    // console.log('diffs')
    // console.log(newBlock);
    // console.log(block);
    // console.log(newBlock.eq(block));
    // console.log(newBlock.sameMarkup(block));
    // console.log(newBlock.check());
    // console.log(JSON.stringify(newBlock.toJSON(), null, 4));
    // console.log(JSON.stringify(block.toJSON(), null, 4));
    // console.log(doc.content.replaceChild(1, newBlock))

    // console.log(block.to JSON())
    // const expectedBlock = doc.cut(start, end)
    // console.log(expectedBlock.toJSON())
    // console.log(newBlock.toJSON())
    // console.log({start, end, from, to})
    //console.log(doc.canReplaceWith(start-1, end+1, block));

    view.dispatch(
      view.state.tr
        // .insertText(text, from, to)
        .replaceWith(start-1, end+1, newBlock2)
    )
    return true
  }
})
