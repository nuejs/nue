import { fileURLToPath } from 'node:url'
import { dirname, relative, join } from 'node:path'

import { parseTag, valueGetter, parseAttr, parseSpecs } from '../src/parse-tag.js'
import { renderTable, parseTable } from '../src/render-tag.js'
import { renderLines } from '../src/render-blocks.js'

const relpath = relative(process.cwd(), dirname(fileURLToPath(import.meta.url)))


// parsing
test('valueGetter', () => {
  const { str, getValue } = valueGetter(`foo="yo" bar="hey dude"`)
  expect(str).toBe('foo=:1: bar=:2:')
  expect(getValue(':1:')).toBe('yo')
  expect(getValue(':2:')).toBe('hey dude')
})

test('parseAttr', () => {
  expect(parseAttr('.bar#foo')).toEqual({ id: 'foo', class: 'bar' })
  expect(parseAttr('.bar#foo.baz')).toEqual({ id: 'foo', class: 'bar baz' })
})

test('parseSpecs', () => {
  expect(parseSpecs('tabs')).toEqual({ name: 'tabs', attr: {} })
  expect(parseSpecs('tabs.#foo.bar')).toEqual({ name: 'tabs', attr: { id: 'foo', class: 'bar' } })
})

test('parse plain args', () => {
  const { name, data }= parseTag('video src="/a.mp4" loop muted')
  expect(name).toBe('video')
  expect(data.loop).toBe(true)
  expect(data.muted).toBe(true)
})

test('parse attrs', () => {
  expect(parseTag('#foo.bar').attr).toEqual({ id: "foo", class: "bar" })
  expect(parseTag('list.tweets').attr).toEqual({ class: "tweets" })
})

test('parse all', () => {
  const { name, attr, data } = parseTag('tip#foo.bar "Hey there" size="40" grayed hidden')
  expect(data).toEqual({ _: "Hey there", size: 40, grayed: true })
  expect(attr).toEqual({ class: "bar", id: "foo", hidden: true })
  expect(name).toBe('tip')
})


// custom tags
const tags = {
  print(data) {
    return `<b>${ data?.value }</b>`
  },
}

test('inline tag', () => {
  const html = renderLines(['Value: [print value="110"]'], { tags })
  expect(html).toBe('<p>Value: <b>110</b></p>')

})

test('block tag', () => {
  const html = renderLines(['[print]', '  value: 110'], { tags })
  expect(html).toBe('<b>110</b>')
})

// accordion
test('[accordion] tag', () => {
  const content = [
    '[accordion.tabbed name="tabs" open]',
    '  ## A',
    '  Desc A',
    '  ## B',
    '  Desc B',
  ]

  const html = renderLines(content)

  expect(html).toStartWith('<div class="tabbed"><details name="tabs" open><summary>A')
  expect(html).toInclude('<summary>B</summary><div><p>Desc B</p>')
})

// list sections
test('[list] sections', () => {
  const content = [
    '[list.features items="card"]',
    '  ## Something',
    '  Described here',

    '  ## Another',
    '  Described here',
  ]

  const html = renderLines(content)
  expect(html).toStartWith('<ul class="features"><li class="card"><h2>Something</h2>\n<p>Described')
})

// list items
test('[list] items', () => {
  const content = ['[list]', '  * foo', '  * bar' ]
  const html = renderLines(content)
  expect(html).toStartWith('<ul><li><p>foo</p></li>')
  expect(html).toEndWith('<li><p>bar</p></li></ul>')
})


// list code blocks
test('[list] blocks', () => {
  const content = ['[list]', '  ``` .foo', '  ```', '  ``` .bar', '  ```']
  const html = renderLines(content)
  expect(html).toStartWith('<ul><li><div class="foo">')
  expect(html).toInclude('<li><div class="bar">')
})

// list code blocks
test('[list] wrapper', () => {
  const html = renderLines(['[list wrapper="pink"]', '  para'])
  expect(html).toStartWith('<div class="pink"><ul><li><p>para</p>')
})


// anonymous tag
test('.list', () => {
  const html = renderLines(['[.list]', '  - elem 1', '  - elem 2'])
  expect(html).toBe('<div class="list"><ul><li><p>elem 1</p></li>\n<li><p>elem 2</p></li></ul></div>')
})

test('.note', () => {
  const html = renderLines(['[.note]', '  ## Note', '  Hello'])
  expect(html).toBe('<div class="note"><h2>Note</h2>\n<p>Hello</p></div>')
})

// anonymous .stack
test('.stack', () => {
  const html = renderLines(['[.stack]', '  Hey', '  +++', '  Girl'])
  expect(html).toStartWith('<div class="stack"><div><p>Hey</p></div>')
})

test('client-side island', () => {
  const html = renderLines(['[contact-me]', '  cta: Submit'])
  expect(html).toStartWith('<contact-me custom="contact-me"><script')
})

test('table options', () => {
  const rows = [['a', 'b'], ['c', 'd'], ['foot']]
  const html = renderTable({ rows, head: true, foot: true, caption: '*Hello*'  })

  expect(html).toStartWith('<table><caption><em>Hello')
  expect(html).toInclude('<thead><tr><th>a</th>')
  expect(html).toInclude('<tr><td>c</td><td>d</td></tr>')
  expect(html).toInclude('<tfoot><tr><th colspan="2">')
})

test('parse table', () => {
  const lines = [
    '| Bar | Baz',
    '---',
    'a | b',
    'c',
    '  ',
    '---',
    'foot'
  ]
  const table = parseTable(lines)
  const { rows } = table
  expect(table.cols).toBe(3)
  expect(table.head).toBe(true)
  expect(table.foot).toBe(true)
  expect(rows.length).toBe(3)
  expect(rows[1]).toEqual([ "a", "b", "c" ])
})


test('[table] with external data', () => {
  const foo = [ ['Foo', 'Buzz'], ['hey', 'girl']]
  const opts = { data: { foo } }

  const html = renderLines(['[table :rows="foo"]'], opts)
  expect(html).toStartWith('<table><thead><tr><th>Foo</th><th>Buzz</th></tr>')

  const html2 = renderLines(['[table :rows="foo" head=false]'], opts)
  expect(html2).toStartWith('<table><tr><td>Foo</td><td>Buzz</td></tr>')

  // table wrapper
  const html3 = renderLines(['[table wrapper="pink" :rows="foo"]'], opts)
  expect(html3).toStartWith('<div class="pink"><table>')

})

test('[table] nested YAML', () => {
  const html = renderLines(['[table]', '  - [foo, bar]', '  - [foo, bar]'])
  expect(html).toStartWith('<table><thead><tr><th>foo</th><th>')
  expect(html).toEndWith('<td>bar</td></tr></table>')
})

test('[table] backwards compatibility', () => {
  const html = renderLines(['[table]', '  - foo | bar'])
  expect(html).toStartWith('<table><tr><td>foo</td>')
})

test('[table] nested string', () => {
  const html = renderLines(['[table head=false]', '  a | b', '  ---', '  c | d'])
  expect(html).toStartWith('<table><thead><')
  expect(html).toEndWith('<td>d</td></tr></table>')
})

test('[table] empty cells', () => {
  const html = renderLines(['[table head=false]', '  | b | c', '  d |     | f'])
  expect(html).toInclude('<tr><td></td><td>b')
  expect(html).toInclude('<td>d</td><td></td><td>f')
})


test('[button] inline label', () => {
  const html = renderLines(['[button href="/" "Hey, *world*"]'])
  expect(html).toBe('<a href="/" role="button">Hey, <em>world</em></a>')
})

test('[button] nested label', () => {
  const html = renderLines(['[button href=/]', '  ![](/joku.png)'])
  expect(html).toStartWith('<a href="/" role="button"><img src="/joku.png"')
})


test('[image] tag', () => {
  const html = renderLines(['[image /meow.png]'])
  expect(html).toBe('<figure><img loading="lazy" src="/meow.png"></figure>')
})

test('[image] nested arg', () => {
  const html = renderLines(['[image]', '  src: img.png'])
  expect(html).toBe('<figure><img loading="lazy" src="img.png"></figure>')
})

test('picture', () => {
  const html = renderLines([
    '[image caption="Hello"]',
    '  href: /',
    '  small: small.png',
    '  large: large.png',
  ])

  expect(html).toStartWith('<figure><a href="/"><picture><source srcset')
  expect(html).toEndWith('</a><figcaption>Hello</figcaption></figure>')
})


test('[video] tag', () => {
  const html = renderLines(['[video /meow.mp4 autoplay]', '  ### Hey'])
  expect(html).toStartWith('<video src="/meow.mp4" type="video/mp4" autoplay>')
  expect(html).toEndWith('<h3>Hey</h3></video>')
})

test('! shortcut', () => {
  const html = renderLines(['[! /meow.mp4 autoplay]'])
  expect(html).toStartWith('<video src="/meow.mp4" type="video/mp4" autoplay>')
})

const svgpath = join(relpath, 'test.svg')

test('[svg]', () => {
  const html = renderLines([`[svg ${svgpath}]`])
  expect(html).toBe('<svg class="icon"/>')
})

test('[svg] nested in [button]', () => {
  const html = renderLines(['[button href="/"]', `  [svg ${svgpath}] *Yo*`])
  expect(html).toBe('<a href="/" role="button"><svg class="icon"/> <em>Yo</em></a>')
})


test('[define]', () => {
  const content = [
    '[define]',
    '  ## Design System { #ds.foo }',
    '  Design system is...',

    '  ## Content First { #cf }',
    '  Content first is...'
  ]

  const html = renderLines(content)
  expect(html).toStartWith('<dl><dt class="foo"><a name="^ds">')
  expect(html).toInclude('Design System</a></dt><dd>')
  expect(html).toEndWith('<dd><p>Content first is...</p></dd></dl>')

})
