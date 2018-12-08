# OEMD grammar
# written in nearley

@{%
var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } };
var appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var log = text => d => { console.log(text, d); return d ;};
%}

blocks -> block {% d => { console.log('blockFound'); return d[0];} %}
#  | blocks newline block {% (blocks, _, reject) => {
#  /*
#  const body = blocks[0]
#  const last = blocks[2]
#  const b1 = blocks[blocks.length-1][0];
#  const b2 = last[0];
#  console.log({b1})
#  console.log({b2})
#
#  //console.log({result: b1.type && b1.type === 'ul'})
#  //console.log({result: b1.type && b1.type === 'ul'})
#  //console.log({result: b1.type && b1.type === 'ul' && b1.type === b2.type})
#  if(b1 && b2 && b1.type && b1.type === 'ul' && b1.type === b2.type) return reject
#  */
#  return blocks[0].concat(blocks[2]);
#  }
#  %}


block ->
  null        {% emptyStr %}
  | text newline
#  | title        {% d => d %}
#  | list
# {% d => console.log('in list', d); return d; %}
#  | [^# ] text

text ->
    null         {% emptyStr %}
   | text char    {% appendItemChar(0,1) %}
#   | text newline


char -> [^\n\r]    {% id %}

newline ->
    "\r" "\n"            {% empty %}
  | "\r" | "\n"          {% empty %}

# title -> titlehashes " " text {% d => ({ type: `h${d[0].length}`, value: d }) %}

# titlehashes -> [#]:+  {% d => d[0].join('') %}

# list -> listitem:+ {% ([items]) => ({ type: "ul", value: items }) %}

# listitem -> " * " text {% d => ({ type: 'li', value: d }) %}
