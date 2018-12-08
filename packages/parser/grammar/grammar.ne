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
const node = (tag, attrs, children) => ({ tag, attrs, children })
const textNode = content => node('text', {}, content)

var flatten = d => [].concat.apply([], ...d)
const containsInline = chars => {
  const l = chars.length

  if (chars[l-1] !== '*') return false
  if (chars.slice(0, -2).join('').includes('*')) return true // em

  return chars[l-2] === '*' && chars.slice(0, -2).join('').includes('**')
}
%}

block ->
  #  paragraph {% d => d %}
    paragraph {% d => node('p', {}, d[0]) %}
  | title     {% id %}
  | list      {% id %}
  | numberlist      {% id %}

paragraph -> text {% (d, _, r) => {
  const inner = d[0][0]
  const text = d[0][0].children
  if (typeof text !== 'string') return d[0]
  if (text.match(/^[#]+ /)) return r
  if (text.match(/^ \* /)) return r
  if (text.match(/^ [1-9]+. /)) return r

  return d[0]
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

  return textNode(chars.join(""))
} %}

title -> titlehashes " " text {% d => {
  const frontText = d[0] + d[1]

  const children = [textNode(frontText), ...d[2]]

  const level = d[0].length

  return node(`h${level}`, {}, children)
} %}
titlehashes -> [#]:+  {% d => d[0].join('') %}

list -> listitem:+ {% tagid('ul') %}
listitem -> " * " text {% tag('li', d => d.slice(0).join('')) %}

numberlist -> numberlistitem:+ {% tagid('ol') %}
numberlistitem -> " " [1-9]:+ ". " text {% tag('li', d => d.slice(0).join('')) %}


bold -> "**" string "**" {% d => {
  const text = `**${d[1].children}**`

  const child = textNode(text)
  return node('strong', {}, [child])
  //return node;
  // return tag('b', d => d.join(''))
} %}
# em -> "*" string "*" {% tag('em', d => d.join(''))%}
