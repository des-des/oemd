import { Schema } from "prosemirror-model"

export const schema = new Schema({
  nodes: {
    text: {
      group: 'inline'
    },
    bold: {
      group: 'inline',
      inline: true,
      content: 'text*',
      toDOM() { return ["strong", 0] },
      parseDOM: [{tag: 'strong'}]
    },
    h1: {
      group: 'block',
      content: "inline*",
      toDOM() { return ["h1", 0] },
      parseDOM: [{tag: "h1"}]
    },
    paragraph: {
      group: 'block',
      content: "inline*",
      toDOM() { return ["p", 0] },
      parseDOM: [{tag: "p"}]
    },
    doc: {
      content: "block+"
    }
  }
})

// console.log(schema);
// module.exports = schema

export default schema
