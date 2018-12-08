# OEMD grammar
# written in nearley

@{%
var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } };
var appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var log = text => d => { console.log(text, d); return d ;};
var unwrap = d => d[0]
var tag = (type, f = d => d) => d => ({ type: typeof type === 'function' ? type(d) : type, value: f(d) })
var tagid = type => d => ({ type: type, value: d[0] })
const schema = require('../prose/dist/schema.js').default

var flatten = d => [].concat.apply([], ...d)
const containsInline = chars => {
  const l = chars.length

  if (chars[l-1] !== '*') return false
  if (chars.slice(0, -2).join('').includes('*')) return true // em

  return chars[l-2] === '*' && chars.slice(0, -2).join('').includes('**')
}
%}

document -> block:+ {% ([blocks], _, reject) => {
  for (let i = 0; i < blocks.length - 1; i++) {
    const b1 = blocks[i];
    const b2 = blocks[i+1];

    if(b1 && b2 && b1.type && b1.type === 'ul' && b1.type === b2.type) return reject
  }
  return blocks;
}
 %}

block ->
  #  paragraph {% d => d %}
    paragraph {% d => schema.node('paragraph', {}, d[0]) %}
  | title     {% id %}
  | list      {% id %}
  | numberlist      {% id %}

paragraph -> newline text {% (d, _, r) => {
  const inner = d[1][0]
  const text = d[1][0].text
  if (text.match(/^[#]+ /)) return r
  if (text.match(/^ * /)) return r
  if (text.match(/^ [1-9]+. /)) return r

  return d[1]
}%}

text ->
    string
    | inline
    | text inline {% d => d[0].concat(d[1]) %}
    | inline text

inline ->
    bold {% id %}
#  | em {% id %}

string -> [^\n]:+ {% ([chars], _, r) => {
  const l = chars.length
  if (containsInline(chars)) return r

  return schema.text(chars.join(""))
} %}

newline ->
    "\r" "\n"            {% empty %}
  | "\r" | "\n"          {% empty %}


title -> newline titlehashes " " text {% d => {
  const frontText = d[1] + d[2]

  const children = [schema.text(frontText), ...d[3]]

  console.log({children})

  return schema.node('h1', {}, children)
//  return tag(d => `h${d[1].length}`, d => d.slice(1))
} %}
titlehashes -> [#]:+  {% d => d[0].join('') %}

list -> listitem:+ {% tagid('ul') %}
listitem -> newline " * " text {% tag('li', d => d.slice(1).join('')) %}

numberlist -> numberlistitem:+ {% tagid('ol') %}
numberlistitem -> newline " " [1-9]:+ ". " text {% tag('li', d => d.slice(1).join('')) %}


bold -> "**" string "**" {% d => {
  const text = `**${d[1].text}**`

  const child = schema.text(text)
  const node = schema.node('bold', {}, child)
  return node;
  // return tag('b', d => d.join(''))
} %}
# em -> "*" string "*" {% tag('em', d => d.join(''))%}