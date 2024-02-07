import { parseMeta, parseBlocks, parseSections, parsePage, parseHeading } from '../src/parse.js'
import { parseComponent, valueGetter, parseAttr, parseSpecs } from '../src/component.js'
import { renderIsland, renderLines } from '../src/render.js'
import { nuemarkdown } from '../index.js'
import { tags } from '../src/tags.js'


test('fenced code', () => {
  const { html } = renderLines(['``` md.foo.bar', `<h1>hey</h1>`, '```'])
  expect(html).toStartWith('<figure class="foo bar"><pre glow="md">')
  expect(html).toInclude('<i>')
})

test('[code]', () => {
  const html = tags.code({ content: ['<p>Hey</p>'], language: 'xml', numbered: true, wrapper: 'foo' })
  expect(html).toStartWith('<div class="foo"><figure><pre glow="xml">')
  expect(html).toInclude('<i>')
})

test('[code caption]', () => {
  const html = tags.code({ content: ['<!-- Hey -->'], caption: 'Boss' })
  expect(html).toInclude('<figcaption><h3>Boss')
  expect(html).toInclude('<sup>&lt;!-- Hey')
})

test('[codeblocks]', () => {
  const html = tags.codeblocks({ content: ['a', 'b'], captions: 'A; B', classes: 'foo; bar' })
  expect(html).toStartWith('<section><figure class="foo">')
  expect(html).toInclude('<figure class="bar"><figcaption><h3>B</h3>')
  expect(html).toInclude('<pre glow')
})

test('[codetabs]', () => {
  const html = tags.codetabs({ content: ['a', 'b'], captions: 'A; B', languages: 'jsx; md' })
  expect(html).toStartWith('<section role="tabs" is="aria-tabs">')
  expect(html).toInclude('<div role="tablist">')
  expect(html).toInclude('<li role="tabpanel"><pre glow="jsx">')
})

test('nested code with comment', () => {
  const { html } = renderLines(['[.test]', '  // not rendered', '  ```', '  // hey', '  ```'])
  expect(html).toStartWith('<div class="test">')
  expect(html).toInclude('<sup>// hey</sup>')
})

test('parse fenced code', () => {
  const blocks = parseBlocks(['# Hey', '``` md.foo#bar', '// hey', '[foo]', '```'])
  const [hey, fenced] = blocks
  expect(fenced.is_code).toBe(true)
  expect(fenced.name).toBe('md')
  expect(fenced.attr).toEqual({ class: 'foo', id: 'bar' })
  expect(fenced.content).toEqual(["// hey", "[foo]"])
})


test('[!] img', () => {
  const icon = tags['!']({ _: 'cat' })
  expect(icon).toStartWith('<img src="/img/cat.svg"')

  const img = tags['!']({ _: 'img.png' })
  expect(img).toStartWith('<img src="img.png"')

  const video = tags['!']({ _: 'img.mp4' })
  expect(video).toStartWith('<video src="img.mp4">')
})

test('[video] sources', () => {
  const html = tags.video({ sources: ['/test.mp4', '/test.webm'], content: ['Nope'] })
  expect(html).toInclude('source src="/test.webm" type="video/webm"')
  expect(html).toInclude('<p>Nope</p>')
})

test('[video] simple', () => {
  const html = tags.video({ _: '/test.mp4', width: 500, loop: true, muted: true, joku: 899 })
  expect(html).toBe('<video src="/test.mp4" loop="loop" muted="muted" width="500"></video>')
})

test('[tabs] attr', () => {
  const html = tags.tabs({ _: 't1 ; t2', content: ['c1', 'c2'], attr: {} })
  expect(html).toInclude('<section role="tabs" is="aria-tabs" class="tabs">')
  expect(html).toInclude('<div role="tablist">')
  expect(html).toInclude('<a role="tab" aria-selected="true">t1</a>')
  expect(html).toInclude('<li role="tabpanel">')
  expect(html).toInclude('<p>c1</p>')
})


const NESTED_TABS = `
[tabs "Foo | Bar"]
  First
  ---
  Second

  [tabs "Baz | Bruh" key="inner"]
    Inner 1
    ---
    Inner 2
`

test('Nested [tabs]', () => {
  const html = nuemarkdown(NESTED_TABS)
  expect(html).toInclude('aria-selected="true">Foo</a>')
  expect(html).toInclude('<a role="tab">Bar</a>')

  expect(html).toInclude('aria-controls="inner-panel-1">Baz</a>')
  expect(html).toInclude('id="inner-tab-2"')
  expect(html).toInclude('id="inner-panel-2"')
})

test('[image] content', () => {
  const html = tags.image({ src: 'a.png', content: ['Hey'] })
  expect(html).toInclude('<figcaption><p>Hey</p>')
  expect(html).toInclude('img src="a.png')
  expect(html).toInclude('figure')
})

test('[image] link', () => {
  const a = tags.image({ _: 'a.png', href: '/' })
  expect(a).toBe('<a href="/"><img src="a.png" loading="lazy"></a>')
})

test('[image] picture', () => {
  const pic = tags.image({ small: 'a.png', large: 'b.png', offset: 800, attr: { class: 'big' } })
  expect(pic).toInclude('picture class="big"')
  expect(pic).toInclude('source src="b.png"')
  expect(pic).toInclude('max-width: 800px')
  expect(pic).toInclude('img src="b.png"')
})

test('[image] caption', () => {
  const figure = tags.image({ src: 'a.png', caption: 'Hey *man*', attr: { class: 'big' } })
  expect(figure).toInclude('<figcaption>Hey <em>man</em></figcaption>')
  expect(figure).toInclude('figure class="big"')
  expect(figure).toInclude('img src="a.png"')
})

test('[image] basics', () => {
  const img = tags.image({ _: 'a.png', alt: 'Hey' })
  expect(img).toBe('<img src="a.png" alt="Hey" loading="lazy">')

  const img2 = tags.image({
      attr: { class: 'big' },
      srcset: ['a.jpg 20vw', 'b.jpg'],
      loading: null,
      sizes: '4em'
  })

  expect(img2).toBe('<img srcset="a.jpg 20vw, b.jpg" sizes="4em" class="big">')
})


test('[layout]', () => {
  const attr = { id: 'epic' }
  const data = { count: 10 }
  const single = tags.layout({ attr, data, content: ['foo'] })

  expect(single).toInclude('<div id="epic">')
  expect(single).toInclude('<p>foo</p>')

  const double = tags.layout({ attr, data, content: ['foo', 'bar'] })
    expect(double).toInclude('<section id="epic">')
})

test('[layout] with nested component', () => {
  const content = ['# Hello', '## World\n[image "joo.png"]']
  const html = tags.layout({ content })
  expect(html).toInclude('<h1 id="hello">')
  expect(html).toInclude('<div><h2 id="world">')
  expect(html).toInclude('img src="joo.png"')
})

test('[table]', () => {
  const html = tags.table({ head: 'Name | Age', items: ['John | 30', 'Mary | 28,5'] })
  expect(html).toInclude('<th>Name</th>')
  expect(html).toInclude('<th>Age</th>')
  expect(html).toInclude('<td>John</td>')
  expect(html).toInclude('<td>Mary</td>')
  expect(html).toInclude('<td>28,5</td>')
})

test('[button]', () => {
  const html = tags.button({ label: '*Hey*' })
  expect(html).toInclude('<a href="#" role="button">')
  expect(html).toInclude('<em>Hey</em>')
})


// page rendering
test('render sections', () => {
  const lines = ['a', 'a', '--- #a.b', 'b', 'b', '---', 'c', 'c']
  const { html } = renderLines(lines, { data: { sections: ['#foo'] } })
  expect(html).toStartWith('<section id="foo"><p>a')
  expect(html).toInclude('<section class="b" id="a"><p>b')
  expect(html).toInclude('<section><p>c')
})

test('generic section', () => {
  const { html } = renderLines(['[.info]', '  # Hello', '  para', '  ---', '  World'])
  expect(html).toInclude('<section class="info">')
  expect(html).toInclude('<p>para</p>')
})

test('reflinks', () => {
  const links = { dude: '//hey.net "boom"' }
  const lines = ['[hey][yolo] [dude][dude]', '[.foo]', '[yolo]: yolo.co "lol"']
  const { html } = renderLines(lines, { data: { links } })

  expect(html).toInclude('<a href="yolo.co" title="lol">hey</a>')
  expect(html).toInclude('<a href="//hey.net" title="boom">dude</a>')
})

test('parseHeading', () => {
  const h1 = parseHeading('# Hey { #me-too.hey.yo }')
  expect(h1.text).toBe('# Hey')
  expect(h1.id).toBe('me-too')
  expect(h1.class).toBe('hey yo')

  const h2 = parseHeading('## Hey')
  expect(h2.text).toBe('## Hey')
  expect(h2.id).toBe('hey')
})

test('heading id', () => {
  const { html } = renderLines(['# Hey _boy_ { #me.too }'])
  expect(html).toInclude('<h1 class="too" id="me">')
  expect(html).toInclude('<a href="#me"')
  expect(html).toInclude('Hey <em>boy</em>')
})

test('page island', () => {
  const { html } = renderLines(['yo', '[hey]', '  bar: 2'])
  expect(html).toInclude('<p>yo</p>')
  expect(html).toInclude('nue-island island="hey"')
  expect(html).toInclude('{"bar":2}')
})

// rendering blocks
test('renderIsland', () => {
  const attr = { id: 'epic' }
  const data = { count: 10 }
  const island = renderIsland({ name: 'foo', attr, data })
  expect(island).toInclude('id="epic" island="foo"')
  expect(island).toInclude('{"count":10}')
})



// page parsing
test('parse sections', () => {
  const els = parseSections(['a', 'a'])
  expect(els[0].lines).toEqual(['a', 'a'])
  expect(els.length).toBe(1)
})

test('parse sections', () => {
  const lines = ['a', 'a', '--- #a.b', 'b', 'b', '---', 'c', 'c']
  const sections = parseSections(lines)
  const [a, b, c] = sections
  expect(sections.length).toBe(3)
  expect(a.lines).toEqual(['a', 'a'])
  expect(b.attr).toEqual({ id: "a", class: "b" })
  expect(c.lines).toEqual(['c', 'c'])
})


test('parse page', () => {
  const page = parsePage(['# Hello', '## World', '[foo]: bar', '[tabs foo=1]', '  bar: 2'])

  expect(page.isomorphic).toBe(true)
  expect(page.links).toHaveProperty('foo')
  expect(page.headings.length).toBe(2)

  const { blocks } = page.sections[0]
  expect(blocks.length).toBe(2)
  expect(blocks[1].data).toEqual({ foo: 1, bar: 2 })
})


test('parse page: ! component', () => {
  const page = parsePage(['[! "/foo"]'])
  const { data, name } = page.sections[0].blocks[0]
  expect(data._).toBe('/foo')
  expect(name).toBe('!')
})

// blocks within sections
test('parse blocks', () => {
  const blocks = parseBlocks(['Hello', '[foo]', '  bar: 10', 'World'])
  const [intro, comp, outro] = blocks
  expect(intro).toEqual(['Hello'])
  expect(comp.name).toEqual('foo')
  expect(comp.body).toEqual(["bar: 10"])
  expect(outro).toEqual(['World'])
})

test('parse single content block', () => {
  const [intro, comp] = parseBlocks(['Yo', '[.info]', '  Hello', '  World'])
  expect(comp.attr.class).toBe('info')
  expect(comp.body).toEqual(["Hello", "World"])
})


test('parseMeta', () => {
  expect(parseMeta(['']).rest).toEqual([''])

  expect(parseMeta(['# Hey']).rest).toEqual(['# Hey'])

  expect(parseMeta(['---', 'title: foo', '---']))
    .toEqual({ meta: { title: "foo" }, rest: [] })

  expect(parseMeta(['---', 'foo: 10', '---', '# Hey']))
    .toEqual({ meta: { foo: 10 }, rest: ['# Hey'] })
})


// parsing components
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

test('parseComponent', () => {

  expect(parseComponent('#foo.bar')).toEqual({
    name: null,
    attr: { id: "foo", class: "bar" },
    data: {},
  })

  expect(parseComponent('list.tweets')).toEqual({
    name: 'list',
    attr: { class: "tweets" },
    data: {},
  })

  expect(parseComponent('tip "Hey there"')).toEqual({
    name: 'tip',
    attr: {},
    data: { _: 'Hey there' },
  })

  expect(parseComponent('img /foo')).toEqual({
    name: 'img',
    attr: {},
    data: { _: '/foo' },
  })

  expect(parseComponent('item cols=3 grayed')).toEqual({
    name: 'item',
    attr: {},
    data: { cols: 3, _: 'grayed' },
  })

  expect(parseComponent('info#alert "Sure ??" class="boss"')).toEqual({
    name: 'info',
    attr: { class: 'boss', id: 'alert' },
    data: { _: 'Sure ??' },
  })

})

/*
  Required:
  bun add react
  bun add react-dom
*/
test('JSX component', async () => {
  try {
    // import React SSR (server side rendering) API method
    const { renderToString } = await import('react-dom/server')

    // import custom JSX components
    const jsx = await import('./react-lib')

    // make them compatible with Nuemark
    const lib = Object.keys(jsx).map(name => {
        return { name, render: (data) => renderToString(jsx[name](data)) }
    })

    // render JSX with Nuemark
    const html = nuemarkdown('[my-test]', { lib, data: { message: 'Hello' } })

    expect(html).toBe('<h1 style="color:red">Hello</h1>')

      // react not imported
  } catch (ignored) {
      console.info('JSX test skipped')
  }
})
