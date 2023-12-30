
import { compile } from '../index.js'

/*
  Format of individual tests on the TESTS array:
  [
    nue_source_code,
    compiled_code_match1,
    compiled_code_match2
  ]
*/
const TESTS = [

  // basics
  ['<div :data-node="item"/>', '<div :data-node="0"></div>', '_.item'],

  ['<div @name="foo">{{ title }}</div>', '<div :html="0"></div>', '_.title'],

  ['<img :class="`_ || src`"/>', '<img :class="0">', '`_ || _.src`'],

  ['<img loading="lazy" :alt="alt" :src="_ || src">',
   '<img loading="lazy" :alt="0" :src="1">', '_._ || _.src'],
  [`<a>{ time || '12:00' }</a>`, '<a>:0:</a>', "[_.time || '12:00']"],

  // class name
  ['<div class="item { is-active: isActive(el) }">{ flag ? "ok" : "fail"}</div>',
    '<div :class="0">:1:</div>', "['item ',_.isActive(_.el) && 'is-active ']"],

  // for loop
  ['<span @name="loop" :for="{ foo, bar } in items">{ foo }</span>',
    '<span :for="0">:1:</span>', "[['foo','bar'], _.items, '$index']"],

  ['<label :for="el, j in survey.sources">{ el }</label>',
    ':for="0"', "['el', _.survey.sources, 'j']"],

  ['<p :for="[key, value, i] in Object.entries(person)"></p>',
    ':for="0"', "[['key','value'], Object.entries(_.person), 'i', true]"],


  // global script tag
  ['<script>const a = 10</script>', 'const a = 10', 'lib = [\n]'],

  ['<b><noscript>Ignore</noscript><script>s = 1</script><script>g = 1</script></b>',
    '<b></b>', 'class { s = 1\ng = 1 }'],

  // event handlers
  ['<button @click="count++">{ count }</button>', '<button @click="0">:1:</button>', '_.count++'],
  ['<a @click="foo(); bar()">{ baz }</a>', '@click="0"', "{ _.foo(); _.bar() }"],

  // click modifiers
  ['<a @click.prevent.once="do"/>',
    '@click="0"', 'e.preventDefault();_.do.call(_, e);e.target.onclick = null'],

  ['<a @keyup.space="do"/>', '@keyup="0"', "if (!['space'"],

  ['<a @keyup.up="do"/>','@keyup="0"', "if (!['up'"],

  ['<a @click.self="do"/>','@click="0"', "if (e.target != this)"],


  // event argument
  [`<a @click="say('yo', $event)"/>`, '@click', "_.say('yo', e)"],
  [`<a @click="say($event, 'yo')"/>`, '@click', "_.say(e, 'yo')"],

  // newline
  ['<a>\n<b @click="open"></b></a>', '@click="0"', '_.open.call'],

]

function testOne([src, ...matches]) {
  const js = compile(src)
  const [ok1, ok2] = matches.map(m => js.includes(m))

  // debug
  if (!ok1 || !ok2) console.info('Error in', src, '-->\n\n', js)

  // run tests
  expect(ok1).toBe(true)
  expect(ok2).toBe(true)
}

test('All compile tests', () => {
  TESTS.forEach(testOne)
})

test(':for error', () => {
  try {
    compile('<h1>Hey</h1>\n<b :for="foo bar"></b>')
  } catch (e) {
    expect(e.expr).toBe('foo bar')
    expect(e.column).toBe(9)
    expect(e.line).toBe(2)
  }
})


// good for testing a single thing with test.only()
test('Unit test', () => {
  const last = TESTS.slice(-1)[0]
  testOne(last)
})


