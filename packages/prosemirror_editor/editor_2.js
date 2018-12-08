import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {exampleSetup} from "prosemirror-example-setup"

import parse from '../parser/parse.js'
import schema from './schema.js'

console.log('CAN I EVEN LOG SHIT');

const editorNode = document.querySelector("#editor");

const observerOptions = {
  childList: true,
  attributes: true,
  subtree: true //Omit or set to false to observe only changes to the parent node.
}

const onMutation = mutation => ({
  
})

const observer = new MutationObserver(callback);
observer.observe(targetNode, observerOptions);


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
