
import { parseComponent, valueGetter, parseAttr } from '../src/component.js'
import { parseMeta, parseBlocks, parsePage } from '../src/parse.js'
import { renderIsland, render } from '../src/render.js'
import { tags, getGridCols } from '../src/tags.js'


test('[grid]', () => {
  const html = tags.grid({ content: 'abcdefg'.split(''), attr: { class: 'foo' } })
  expect(html).toInclude('<section class="grid foo" style="--cols: 1fr 1fr 1fr"')
  expect(html).toInclude('<div style="--colspan: 3"><p>g</p>')
})

test('grid columns', () => {
  const grid = getGridCols(5, 'a')
  expect(grid.cols).toBe('1fr 1fr')
  expect(grid.colspan).toBe(2)
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
  const html = tags.tabs({ _: 't1, t2', name: 'hey', content: ['c1', 'c2'] })
  expect(html).toInclude('<section is="nue-tabs" class="tabs">')
  expect(html).toInclude('<nav><a href="#hey-1">t1</a>')
  expect(html).toInclude('<li id="hey-2"><p>c2</p>')
})

test('[tabs] body', () => {
  const html = tags.tabs({ content: 'abcd'.split(''), attr: { id: 'hey' } })
  expect(html).toInclude('<section is="nue-tabs" class="tabs" id="hey">')
  expect(html).toInclude('<nav><a href="#tab-1"><p>a</p>')
  expect(html).toInclude('<li id="tab-2"><p>d</p>')
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


test('[section]', () => {
  const attr = { id: 'epic' }
  const data = { count: 10 }
  const single = tags.section({ attr, data, content: ['foo'] })

  expect(single).toInclude('<section id="epic">')
  expect(single).toInclude('<p>foo</p>')

  const double = tags.section({ attr, data, content: ['foo', 'bar'] })
  expect(double).toInclude('<section id="epic">')
})

test('[section] with nested component', () => {
  const content = ['# Hello', '## World\n[image "joo.png"]']
  const html = tags.section({ content })
  expect(html).toInclude('<h1 id="hello">')
  expect(html).toInclude('<div><h2 id="world">')
  expect(html).toInclude('img src="joo.png"')
})

test('[table]', () => {
  const html = tags.table({ head: 'Name, Age', items: ['John, 30', 'Mary, 28']})
  expect(html).toInclude('<th>Name</th>')
  expect(html).toInclude('<th>Age</th>')
  expect(html).toInclude('<td>John</td>')
  expect(html).toInclude('<td>Mary</td>')
})

test('[button]', () => {
  const html = tags.button({ label: '*Hey*'})
  expect(html).toInclude('<a href="#" role="button">')
  expect(html).toInclude('<em>Hey</em>')
})


// page rendering

test('generic section', () => {
  const { html } = render(['[.info]', '  # Hello', '  para', '  ---', '  World'])
  expect(html).toInclude('<section class="info">')
  expect(html).toInclude('<p>para</p>')
})


test('reflinks', () => {
  const links = { dude: '//hey.net "boom"' }
  const lines = ['[hey][yolo] [dude][dude]', '[.foo]', '[yolo]: yolo.co "lol"']
  const { html } = render(lines, { data: { links } })

  expect(html).toInclude('<a href="yolo.co" title="lol">hey</a>')
  expect(html).toInclude('<a href="//hey.net" title="boom">dude</a>')
})

test('header id', () => {
  const { html } = render(['# Hey baari on jotain {#custom}'])
  expect(html).toInclude('<h1 id="custom">')
  expect(html).toInclude('<a href="#custom"')
})


test('page island', () => {
  const { html } = render(['yo', '[hey]', '  bar: 2'])
  expect(html).toInclude('<p>yo</p>')
  expect(html).toInclude('nue-island island="hey"')
  expect(html).toInclude('{"bar":2}')
})


// page parsing

test('[!] parse', () => {
  const page = parsePage(['[! "/foo"]'])
  const { data, name } = page.sections[0]
  expect(data._).toBe('/foo')
  expect(name).toBe('!')
})


test('parse page', () => {
  const page = parsePage(['# Hello', '## World', '[foo]: bar', '[hey foo=1]', '  bar: 2'])
  const { sections } = page

  expect(page.links).toHaveProperty('foo')
  expect(page.headings.length).toBe(2)
  expect(sections.length).toBe(2)
  expect(sections[1].data).toEqual({ foo: 1, bar: 2 })
})

test('parse blocks', () => {
  const blocks = parseBlocks(['Hello', '[foo]', '  bar: 10', 'World'])
  const [intro, comp, outro] = blocks
  expect(intro).toEqual(['Hello'])
  expect(comp.name).toEqual('foo')
  expect(comp.body).toEqual([ "bar: 10" ])
  expect(outro).toEqual(['World'])
})

test('parse single content block', () => {
  const [intro, comp] = parseBlocks(['Yo', '[.info]', '  Hello', '  World'])
  expect(comp.attr.class).toBe('info')
  expect(comp.body).toEqual([ "Hello", "World" ])
})


test('parseMeta', () => {

  expect(parseMeta(['']).rest).toEqual([''])

  expect(parseMeta(['# Hey']).rest).toEqual(['# Hey'])

  expect(parseMeta(['---', 'title: foo', '---']))
    .toEqual({ meta: { title: "foo" }, rest: [] })

  expect(parseMeta(['---', 'foo: 10', '---', '# Hey']))
    .toEqual({ meta: { foo: 10 }, rest: ['# Hey'] })
})



// rendering blocks

test('renderIsland', () => {
  const attr = { id: 'epic' }
  const data = { count: 10 }
  const island = renderIsland({ name: 'foo', attr, data })
  expect(island).toInclude('id="epic" island="foo"')
  expect(island).toInclude('{"count":10}')
})


// parsing components


test('valueGetter', () => {
  const { str, getValue } = valueGetter(`foo="yo" bar="hey dude"`)
  expect(str).toBe('foo=:1: bar=:2:')
  expect(getValue(':1:')).toBe('yo')
  expect(getValue(':2:')).toBe('hey dude')
})

test('parseAttr', () => {
  expect(parseAttr('#foo.bar')).toEqual({ id: 'foo', class: 'bar'})
  expect(parseAttr('.bar#foo')).toEqual({ id: 'foo', class: 'bar'})
  expect(parseAttr('.bar#foo.baz')).toEqual({ id: 'foo', class: 'bar baz'})
})


test('parseComponent', () => {

  expect(parseComponent('#foo.bar')).toEqual({
    attr: { id: "foo", class: "bar" }, data: {},
  })

  expect(parseComponent('list.tweets')).toEqual({
    name: 'list', attr: { class: "tweets" }, data: {},
  })

  expect(parseComponent('tip "Hey there"')).toEqual({
    name: 'tip', attr: {}, data: {_: 'Hey there'},
  })

  expect(parseComponent('img /foo')).toEqual({
    name: 'img', attr: {}, data: { _: '/foo' },
  })

  expect(parseComponent('item cols=3 grayed')).toEqual({
    name: 'item', attr: {}, data: { cols: 3, _: 'grayed' },
  })

  expect(parseComponent('info "Sure ??" #alert class="boss"')).toEqual({
    name: 'info', attr: { class:'boss', id: 'alert' }, data: { _: 'Sure ??' },
  })

})


test('syntax highlight', async () => {
  try {
    const nuecolor = await import('nuecolor')
    const opts = { highlight: nuecolor.default }

    // syntax block
    const { html } = render(['``` md', '# hey', '```'], opts)
    expect(html).toInclude('<pre><code class="language-md">')
    expect(html).toInclude('<b class=hl-heading> hey</b>')

    // code tabs
    const tabs = tags.codetabs({ _: 't1, t2', content: ['# c1', '*c2*'], type: 'md' }, opts)
    expect(tabs).toInclude('<a href="#tab-1">t1</a>')
    expect(tabs).toInclude('<b class=hl-heading> c1</b>')
    expect(tabs).toInclude('</code></pre>')

  } catch(ignore) { console.info(ignore) /* highlighter not found */ }

})