# OEMD grammar
# written in nearley

@{%
var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } };
var appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var log = text => d => { console.log(text, d); return d ;};
var unwrap = d => d[0]
var flatten = d => [].concat.apply([], ...d)
%}

document -> block:+ {% ([blocks], _, reject) => {
  const b1 = blocks[blocks.length-1];
  const b2 = blocks[blocks.length-2];
  if(b1 && b2 && b1.type && b1.type === 'ul' && b1.type === b2.type) return reject
  return blocks;
}
 %}

block ->
    paragraph {% id %}
  | title {% id %}
  | list {% unwrap %}

text ->
    textrun
    | inline:+ {% flatten %}

inline ->
    text bold {% d => console.log('il1', d) || d %}
  | bold {% id %}

paragraph -> newline text {% d => d[1] %}

astrix -> "*"

string -> [^\n*#]:* {% ([chars]) => chars.join("") %}

textrun ->
    string {% id %}
  | string astrix {% d => d[0] + d[1] %}
  | string astrix astrix
  | astrix string
  | astrix astrix string

newline ->
    "\r" "\n"            {% empty %}
  | "\r" | "\n"          {% empty %}


title -> newline titlehashes " " textrun {% d => ({ type: `h${d[1].length}`, value: d.slice(1) }) %}
titlehashes -> [#]:+  {% d => d[0].join('') %}

list -> listitem:+ {% ([items]) => ({ type: "ul", value: items }) %}
listitem -> newline " * " text {% d => ({ type: 'li', value: d }) %}

bold -> "**" textrun "**"
emph -> "*" textrun "*"
