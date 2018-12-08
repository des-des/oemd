var grammar = require('./grammar.js')
var nearley = require('nearley')

const parse = text => {
  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)

  if (text === '') return [{ tag: 'br', attrs: {}, children: [] }]

  parser.current = 0
  parser.feed(text)

  // console.log(text);
  // console.log(parser);

  const results = parser.results

  // console.log({
  //   input: text,
  //   results
  // });

  return results
}

module.exports = parse
