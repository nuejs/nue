
import { renderTable, renderHeading, renderLines } from '../src/render-blocks.js'
import { parseBlocks, isHR, parseHeading } from '../src/parse-blocks.js'
import { nuemark } from '..'


test('parse hr', () => {
  const hrs = ['***', '___', '- - -', '*** --- ***']
  for (const str of hrs) {
    expect(isHR(str)).toBe(true)
  }
  expect(isHR('*** yo')).toBeUndefined()
})

test('render HR', () => {
  expect(renderLines(['hello', '***'])).toBe('<p>hello</p>\n<hr>')
})

test('parse heading', () => {
  const h = parseHeading('# Hello')
  expect(h).toMatchObject({ attr: { id: "hello" }, text: 'Hello', level: 1 })
})

test('heading class & id', () => {
  const h = parseHeading('# Hello, *World!* { #foo.bar }')
  expect(h.text).toBe('Hello, World!')
  expect(h.attr).toEqual({ class: "bar", id: "foo" })

  const html = renderHeading(h, { heading_ids: true })
  expect(html).toStartWith('<h1 class="bar" id="foo"><a href="#foo"')
  expect(html).toInclude('Hello, <em>World!</em>')
})

test('heading class name', () => {
  const html = nuemark('# Hello { .boss }')
  expect(html).toBe('<h1 class="boss">Hello</h1>')
})

test('render heading', () => {
  expect(nuemark('# Hello')).toBe('<h1>Hello</h1>')
  expect(nuemark('##Hello')).toBe('<h2>Hello</h2>')
  expect(nuemark('### Hello, *world*')).toBe('<h3>Hello, <em>world</em></h3>')
})

test('heading ids', () => {
  const html = nuemark('# Hello', { heading_ids: true })
  expect(html).toBe('<h1 id="hello"><a href="#hello" title="Hello"></a>Hello</h1>')
})

test('heading block count', () => {
  const blocks = parseBlocks(['# Yo', 'rap', '## Bruh', 'bat', '## Bro'])
  expect(blocks.length).toBe(5)
})


test('numbered list', () => {
  const [ list ] = parseBlocks(['1. Yo', '10. Bruh', '* Bro'])
  expect(list.numbered).toBeTrue()
  expect(list.entries).toEqual([[ "Yo" ], [ "Bruh" ], [ "Bro" ]])
})

test('render simple list', () => {
  const html = renderLines(['1. ## Hey', '  dude', '2. ## Yo'])
  expect(html).toStartWith('<ol><li><h2>Hey</h2>\n<p>dude</p>')
})

test('nested lists', () => {
  const html = renderLines(['* ## Hey', '   1. dude'])
  expect(html).toStartWith('<ul><li><h2>Hey</h2>')
  expect(html).toEndWith('<ol><li><p>dude</p></li></ol></li></ul>')
})

test('render blockquote', () => {
  const html = renderLines(['> ## Hey', '> 1. dude'])
  expect(html).toStartWith('<blockquote><h2>Hey</h2>\n<ol><li><p>dude')
})

test('render fenced code', () => {
  const html = renderLines(['``` css.pink numbered', 'em {}', '```'])
  expect(html).toStartWith('<div class="pink"><pre><code language="css"><span>')
})

test('multi-line list entries', () => {
  const [ list ] = parseBlocks(['* foo', '  boy', '* bar'])
  expect(list.entries).toEqual([ [ "foo", "boy" ], [ "bar" ] ])
})

test('list object model', () => {
  const [ { items } ] = parseBlocks(['* > foo', '  1. boy', '  2. bar'])
  const [ [ quote, nested ] ] = items

  expect(quote.is_quote).toBeTrue()
  expect(nested.is_list).toBeTrue()
})

test('blockquote', () => {
  const [ quote ] = parseBlocks(['> foo', '> boy'])
  expect(quote.is_quote).toBeTrue()
  expect(quote.content).toEqual([ "foo", "boy" ])
})

test('fenced code blocks', () => {
  const [ code ] = parseBlocks(['``` css.foo numbered', 'func()', '```'])

  expect(code.name).toBe('css')
  expect(code.attr).toEqual({ class: 'foo' })
  expect(code.code).toEqual([ "func()" ])
  expect(code.data.numbered).toBeTrue()
})

test('tables', () => {
  const [ table ] = parseBlocks([
    '| Month    | Amount  |',
    '| -------- | ------- |',
    '| January  | $250    |',
    '| February | $80     |',
  ])

  expect(table.rows[1]).toEqual([ "January", "$250" ])
  expect(table.rows.length).toBe(3)
  expect(table.head).toBeTrue()

  const html = renderTable(table)
  expect(html).toStartWith('<table><tr><th>Month</th><th>Amount</th>')
  expect(html).toEndWith('<td>February</td><td>$80</td></tr></table>')
})

test('block mix', () => {
  const blocks = parseBlocks([
    '#Hello, world!',
    '- small', '- list',
    'paragraph', '',
    '```', '## code', '```',
    '[accordion]', '  multiple: false',
    '> blockquote',
  ])

  expect(blocks.length).toBe(7)
  expect(blocks[1].entries.length).toBe(2)
  expect(blocks[4].code).toEqual([ "## code" ])
  expect(blocks[5].name).toBe('accordion')
})

test('parse reflinks', () => {
  const { reflinks } = parseBlocks([
    '[.hero]',
    '  # Hello, World',
    '  [foo]: //website.com',
    '[1]: //another.net "something"'
  ])

  expect(reflinks).toEqual({
    1: '//another.net "something"',
    foo: '//website.com',
  })
})

test('render reflinks', () => {
  const links = { external: 'https://bar.com/zappa "External link"' }
  const html = renderLines([
    '[Hey *dude*][local]',
    'Inlined [Second][external]',
    '[local]: /blog/something.html "Local link"'
  ], { data: { links }})

  expect(html).toInclude('<a href="/blog/something.html" title="Local link">Hey <em>dude</em></a>')
  expect(html).toInclude('Inlined <a href="https://bar.com/zappa" title="External link">Second</a>')
})

test('nested tag data', () => {
  const [ comp ] = parseBlocks(['[hello#foo.bar world size="10"]', '  foo: bar'])
  expect(comp.attr).toEqual({ class: "bar", id: "foo", })
  expect(comp.data).toEqual({ world: true, size: 10, foo: "bar", })
})

test('escaping', () => {
  const html = renderLines([
    '\\[code]', '',
    '\\> blockquote', '',
    '\\## title',
  ])

  expect(html).toInclude('<p>[code]</p>')
  expect(html).toInclude('<p>> blockquote</p>')
  expect(html).toInclude('<p>## title</p>')
})

test('before render callback', () => {
  function beforerender(block) {
    if (block.is_heading) block.level = 2
    if (block.is_content) block.content = ['World']
  }

  const html = renderLines(['# Hello', 'Bar'], { beforerender })
  expect(html).toBe('<h2>Hello</h2>\n<p>World</p>')
})





