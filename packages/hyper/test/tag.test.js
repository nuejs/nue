
import { parseTag, convertFunctions, convertGetters } from '../src/compiler/tag.js'
import { tokenize } from '../src/compiler/tokenizer.js'
import { parseBlocks } from '../src/compiler/page.js'


function testTag(template, expected) {
  const [ block ] = parseBlocks(tokenize(template))

  const tag  = parseTag(block)
  if (expected === true) return tag

  expect(tag).toEqual(expected)
}


test('closed tag', () => {
  testTag('<foo/>', { tag: 'foo', is_custom: true })
})

test('SVG tag', () => {
  testTag('<path/>', { tag: 'path', svg: true })
})

test('is attrib', () => {
  testTag('<p :is="hey">Hello</p>', { tag: 'p', is: 'hey', children: [{ text: 'Hello' }] })
})


test('nested element', () => {
  testTag('<foo><p>Hi</p></foo>', {
    tag: "foo",
    is_custom: true,
    children: [{ tag: "p", children: [{ text: "Hi" }]}]
  })
})

test('nested tag', () => {
  testTag('<p><bar :count=2></p>', {
    tag: 'p',
    children: [{
      tag: 'bar',
      attr: [{ name: 'count', fn: '2', is_data: true } ],
     is_custom: true,
   }],
  })
})

test('element with expression', () => {
  testTag('<p>${ val } #{ val }</p>', {
    children: [ {fn: '_.val', }, {fn: '_.val', html: true, }],
    tag: "p",
  })
})

test('nested script', () => {
  const template = `
    <counter>
      <script>this.count = 1</script>
    </counter>
  `
  testTag(template, {
    tag: "counter",
    script: "this.count = 1",
    is_custom: true,
  })
})

test('client script', () => {
  const ast = testTag(`
    <body>
      <script src="/analytics.js"></script>
      <script type="module">alalytics(666)</script>
      <script></script>
    </body>
  `, true)

  expect(ast.children.length).toBe(2)
})


test('conditional', () => {
  const template = `
    <cond-test>
      <h3>Hello</h3>
      <b :if="am < 100">Lol</b>
      <b :else-if="am < 50">Mid</b>
      <b :else>Meh</b>
      <a :if="foo">Test</a>
    </cond-test>
  `
  const kids = testTag(template, true).children
  expect(kids.length).toBe(3)
  expect(kids[1].some.length).toBe(3)
  expect(kids[2].some.length).toBe(1)
})

test('slot', () => {
  const template = `
    <slot-test>
      <h3>Hello</h3>
      <slot/>
    </slot-test>
  `
  const kids = testTag(template, true).children
  expect(kids[1]).toEqual({ slot: true })
})

test('newlines', () => {
  const template = `
    <textarea
      amount="10"
      class="bar">
      foo
      bar
    </textarea>
  `
  const tag = testTag(template, true)
  expect(tag.tag).toBe('textarea')
  expect(tag.attr.length).toBe(2)
  expect(tag.children[0].text).toInclude('\n')
})


test('skip style tags', () => {
  testTag('<div><style></style></div>', { tag: 'div' })
})

test('convert function', () => {
  expect(convertFunctions(`format(str) {}`)).toEqual('this.format = function(str) {}')
  expect(convertFunctions(`async format(str) {}`)).toEqual('this.format = async function(str) {}')
  expect(convertFunctions(`if(true) {}`)).toEqual('if(true) {}')
  expect(convertFunctions(`for(true) {}`)).toEqual('for(true) {}')
  expect(convertFunctions(`for (true) {}`)).toEqual('for (true) {}')
})

test('convert getters', () => {
  expect(convertGetters('get foo() { }')).toEqual("Object.defineProperty(this, 'foo', { get() { } })")
})