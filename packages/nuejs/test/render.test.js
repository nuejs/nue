
import { render } from '../index.js'


// helper function to run multiple tests at once
function runTests(tests, data) {
  for (const tmpl in tests) {
    const html = render(tmpl, data)
    const val = tests[tmpl]
    expect(html).toBe(val)
  }
}

function debug(tmpl, data) {
  console.info(render(tmpl, data))
}


test('Expressions', () => {
  runTests({
    // whitespace
    '<b>{ type } <i>': '<b>bold <i></i></b>',

    '<b :class="type">Hey</b>': "<b class=\"bold\">Hey</b>",
    '<b class="item { type }"/>': "<b class=\"item bold\"></b>",
    '<img src="/img/icon/{type}.svg">': "<img src=\"/img/icon/bold.svg\">",
    '<b :class="item { type }">Hey</b>': "<b class=\"item bold\">Hey</b>",
    '<time :datetime="date.getDay()">{ date.getDay() }</time>': `<time datetime="6">6</time>`,


    // skip event attributes
    '<a @click="click"/>': '<a></a>',

    '<input :type>': '<input type="bold">',

    // HTML
    '<h2>{ title }</h2>': '<h2>Hey &lt;em&gt;!&lt;/em&gt;</h2>',
    '<h2>{{ title }}</h2>': '<h2>Hey <em>!</em></h2>',
    '<h2 :html="title"/>': '<h2>Hey <em>!</em></h2>',

  }, {
    type: 'bold',
    date: new Date('2000-01-01'),
    title: 'Hey <em>!</em>',
  })
})

test('Comments', () => {
  runTests({ '<!-- hello --><b>World</b>': '<b>World</b>' })
  runTests({ '<!-- hello --><!-- Another --><b>World</b>': '<b>World</b>' })
})

test('Conditionals', () => {

  runTests({
    '<b :if="flag">{ val }</b>': '',
    '<html><style :if="nope">{ nope }</style></html>': '<html></html>',
    '<html><style :if="css">{ css }</style></html>': '<html><style>body { font-family: 100; }</style></html>',
    '<div><b :if="am > 100">No</b><p><a href="#{val}">Yes</a></p></div>': '<div><p><a href="#A">Yes</a></p></div>',
    '<div><b :if="am > 100">No</b><p :else><a href="#{val}">Yes</a></p></div>': '<div><p><a href="#A">Yes</a></p></div>',
    '<a><em :if="flag"></em><b :else>{ val }</b></a>': '<a><b>A</b></a>',
    '<div><b :if="am > 100">No</b><b :else-if="am == 100">Yes</b><b :else>No</b></div>': '<div><b>Yes</b></div>',
    '<div><custom :if="bad"/></div> <b @name="custom">Hey</b>': '<div></div>',
    '<div><custom :if="am > 10"/></div> <b @name="custom">Yes</b>': '<div><b>Yes</b></div>',
  }, {
    css: 'body { font-family: 100; }',
    am: 100,
    val: 'A',
  })
})

test('Methods and variables', () => {
  runTests({
    '<b>{ bg() }<script>bg = () => "/bg"</script></b>': '<b>/bg</b>',
    '<b>{ bg }<script>get bg() { return "/bg" }</script></b>': '<b>/bg</b>',
    '<b>{ foo }<script>foo = 1</script></b>': '<b>1</b>',
  })
})

test('Class and style', () => {
  runTests({
    '<b class="this { thing } { should: true, be: 1, baz: 0, lol: null, great: -1 }"/>':
      '<b class=\"this thing should be great\"></b>',

    '<b style="font-weight: calc(2em + 5%); color: { color}"/>':
      '<b style="font-weight: calc(2em + 5%); color: #ccc"></b>',

  }, {
    color: '#ccc',
    thing: 'thing',
  })
})


test('Loops', () => {

  runTests({

    '<p :for="n in nums">{ n }</p>': '<p>-1</p><p>0</p><p>1</p>',

    '<p :for="[key, value, i] in Object.entries(person)">{ i }: { key } = { value }</p>':
      '<p>0: name = Nick</p><p>1: email = nick@acme.org</p><p>2: age = 10</p>',

    '<p :for="({ name }, i) in items">{ i }. { name }</p>' : '<p>0. John</p><p>1. Alice</p>',

    // loop custom tag
    '<show :for="el in items" :value="el.name"/> <b @name="show">{ value }</b>' :
      '<b>John</b><b>Alice</b>',

    // loop slots
    '<thing :for="el in items" :bind="el"><b>{ el.age }</b></thing><u @name="thing">{name}: <slot/></u>' :
      '<u>John: <b>22</b></u><u>Alice: <b>33</b></u>',

    // successive loops
    '<div><p :for="x in nums">{ x }</p><a :for="y in nums">{ y }</a></div>':
      '<div><p>-1</p><p>0</p><p>1</p><a>-1</a><a>0</a><a>1</a></div>',

  }, {
    items: [ { name: 'John', age: 22 }, { name: 'Alice', age: 33 }],
    person: { name: 'Nick', email: 'nick@acme.org', age: 10 },
    nums: [-1, 0, 1],
  })
})


test('Custom tags', () => {
  const btn = '<button @name="btn">{ label || "Press"}</button>'

  runTests({
    '<foo/> <a @name="foo">Test</a>': '<a>Test</a>',
    '<media/><label @name="media"/>': '<label></label>',

    // $attrs
    '<field name="foo" value="bar"/><label @name="field"><input :attr="$attrs"/></label>':
      '<label><input name="foo" value="bar"></label>',
  })
})


test('Advanced', () => {

  // return debug('', { val: 1 })

  runTests({

    // :attr (:bind works the same on server side)
    '<dd :attr="person"></dd>': '<dd name="Nick" age="10"></dd>',

    '<hey :val/>': '<nue-island island="hey">\n  <script type="application/json">{"val":"1"}</script>\n</nue-island>',

    // nue element
    // '<foo :nums="nums" :person="person" data-x="bar"/>':
    //   '<nue-island island="foo" data-x="bar">\n  <script type="application/json">{"nums":[1,2],"person":{"name":"Nick","age":10}}</script>\n</nue-island>',

    '<html><slot for="none"/><b>{ val }</b></html>': '<html><b>1</b></html>',
    '<html><slot for="page"/></html>': '<html><main>Hello</main></html>',

    // custom tag and slots
    '<parent><p>{{ am }}</p><p>{ person.name }</p></parent><div @name="parent"><h3>Parent</h3><slot/></div>':
      '<div><h3>Parent</h3><p></p><p>Nick</p></div>',

  }, {
    person: { name: 'Nick', age: 10 },
    page: '<main>Hello</main>',
    nums: [1, 2],
    val: 1
  })

})


const GLOBAL_SCRIPT = `
<script>
  function toLower(str) {
    return str.toLowerCase()
  }
</script>

<div>
  { lower(title) }

  <script>
    lower(str) {
      return toLower(str)
    }
  </script>
</div>`

test('Global script', () => {
  const html = render(GLOBAL_SCRIPT, { title: 'Hey' })
  expect(html).toStartWith('<div>')
  expect(html).toInclude('hey')
})

const GA = `
<body>
  <script async src="https://ga.com/js?id=666"></script>

  <script client>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments)}
  </script>
</body>
`

test('GA', () => {
  const html = render(GA)
  expect(html).toInclude('<script async src')
  expect(html).toInclude('<script>')
  expect(html).toInclude('(){dataLayer.push(arguments)}')
})


const IF_SIBLING = `
<nav @name="navi">
  <a :for="el in els">
    <img :if="el.img">
    <span :if="el.label">{ el.label }</span>
  </a>
</nav>
`

test('If sibling', () => {
  const els = [{ label: 'First'}]
  const html = render(IF_SIBLING, { els })
  expect(html).toInclude('First')
})


test(':for error', () => {
  try {
    render('<div>\n<h1>Hey</h1>\n<b :for="foo bar"></b></div>')

  } catch (e) {
    expect(e.lineText).toInclude(':for="foo bar"')
    expect(e.column).toBeGreaterThan(1)
    expect(e.line).toBe(3)
  }
})

test('{ expr } error', () => {
  try {
    render('<div>\n<b>Hey { foo[0] } { title }</b></div>')

  } catch (e) {
    // Getting different results from different environments
    // bun: TypeError: undefined is not an object (evaluating '_.foo[0]')
    if (process.isBun) {
      expect(e.subexpr).toBe('foo[0]')
      expect(e.line).toBe(2)
      expect(e.column).toBe(9)
    } else {
      // node: TypeError: Cannot read properties of undefined (reading '0')
      expect(e.subexpr).toBe('0')
      expect(e.line).toBe(2)
      expect(e.column).toBe(13)
    }
  }
})

