
import { render } from '../src/index.js'


jest.spyOn(console, 'error').mockImplementation(() => {})
jest.spyOn(console, 'warn').mockImplementation(() => {})
afterEach(() => console.error.mockClear())

test('element', () => {
  expect(render('<div/>')).toBe('<div></div>')
})

test('text', () => {
  expect(render('<div>Hello</div>')).toBe('<div>Hello</div>')
})

test('expression', () => {
  expect(render('<div>${ 1 + 2 }</div>')).toBe('<div>3</div>')
})

test('NaN values', () => {
  expect(render('<div>${ a * b }</div>')).toBe('<div>N/A</div>')
})

test('expression whitespace', () => {
  expect(render('<a>${ "a" } ${ "b" }</a>')).toBe('<a>a b</a>')
})

test('text whitespace', () => {
  const template = '<div>${ a } / ${ b } (${ c }) !</div>'
  const html = render(template, { a: 1, b: 2, c: 3 })
  expect(html).toBe('<div>1 / 2 (3) !</div>')
})

test('tag whitespace', () => {
  const html = render('<a><b>Hey</b> <em>Yo</em></a>')
  expect(html).toInclude('</b> <em>')
})

test('component + text whitespace', () => {
  const html = render('<a><note/> Bro</a><note>Yo</note>')
  expect(html).toBe('<a><div>Yo</div> Bro</a>')
})

test('errors', () => {
  const html = render('<div>${ foo() }</div>')
  expect(html).toBe('<div>[Error]</div>')
  expect(console.error).toHaveBeenCalled()
})

test('do not render event handlers', () => {
  const html = render('<a :onclick="click"></a>', { click: () => true })
  expect(html).toBe('<a></a>')
})

test('attributes', () => {
  const html = render(`<a class="btn" disabled/>`)
  expect(html).toBe('<a class="btn" disabled=""></a>')
})

test('attribute expressions', () => {
  const html = render(`<a class="${'f' + 1}"/>`)
  expect(html).toBe('<a class="f1"></a>')
})

test('render prop', () => {
  const html = render('<h1>${ msg }</h1>', { msg: 'Hello'})
  expect(html).toBe('<h1>Hello</h1>')
})


test('nesting', () => {
  const template = '<div><span>${ text }</span></div>'
  const html = render(template, { text: 'Nested' })
  expect(html).toBe('<div><span>Nested</span></div>')
})


test('svg', () => {
  const template = `
    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24">
      <foreignobject/>
      <path d="M6 8a6 6 0 0 1 12"/>
    </svg>
  `
  const svg = render(template)

  expect(svg).toStartWith('<svg xmlns="http://www.w3.org/2000/svg"')
  expect(svg).toInclude('<path d="M6 8a6 6 0 0 1 12">')

  // fix cases
  expect(svg).toInclude('viewBox')
  expect(svg).toInclude('foreignObject')
})

test('interpolation', () => {
  const template = '<div class="item ${ type }"/>'
  const html = render(template, { type: 'active' })
  expect(html).toBe('<div class="item active"></div>')
})

test('html', () => {
  const html = render('<div>#{ html } here</div>', { html: '<b>Bold</b> text' })
  expect(html).toBe('<div><b>Bold</b> text here</div>')
})

test('html false', () => {
  const html = render('<a>#{ html }</a>', { html: false })
  expect(html).toBe('<a></a>')
})

test('class mapping', () => {
  const template = '<label class="{ is-active: foo } bar">Test</label>'
  const html = render(template, { foo: true })
  expect(html).toBe('<label class="is-active bar">Test</label>')
})

test('class mapping with functions', () => {
  const template = '<div class="{ active: isActive(), error: hasError() }">Test</div>'
  const html = render(template, { isActive: () => true, hasError: () => true })
  expect(html).toBe('<div class="active error">Test</div>')
})

test(':var-* attributes', () => {
  const template = '<a --index="1" --random="${ random }"></a>'
  const html = render(template, { random: 100 })
  expect(html).toBe('<a style="--index:1;--random:100;"></a>')
})

test('max class names', () => {
  const tmpl = '<a class="${ class }"/>'
  render(tmpl, { class: 'foo bar baz boo' })
  render(tmpl, { class: 'foo bar' }, { max_class_names: 1 })
  expect(console.error).toHaveBeenCalledTimes(2)
})

test('invalid character warnings', () => {
  render('<a class="hover:md"/>')
  render('<a class="foo[1]"/>')
  render('<a class="bar"/>')
  expect(console.error).toHaveBeenCalledTimes(2)
})


test('template if', () => {
  const template = `
    <dl>
      <template :if="flag">
        <dt>Foo</dt>
      </template>
      <template :else>
        <dt>Bar</dt>
      </template>
    </dl>
  `
  expect(render(template, { flag: true })).toBe('<dl><dt>Foo</dt></dl>')
  expect(render(template)).toBe('<dl><dt>Bar</dt></dl>')
})

test('bad if clause', () => {
  expect(render('<div><b :if="bad.clause"/></div>')).toBe('<div></div>')
})

test('component conditional', () => {
  const template = `
    <div>
      <note :if="obj.error"/>
    </div>

    <note>Hello</note>
  `
  const html = render(template, { obj: { error: true } })
  expect(html).toBe('<div><div>Hello</div></div>')
})


test('if-else', () => {
  const template = `
    <div>
      <h3>Hello</h3>
      <b :if="am < 10">Small</b>
      <b :else-if="am < 50">Mid</b>
      <strong :else>Big</strong>
      <a :if="none">Empty</a>
    </div>`

  const html = render(template, { am: 30 })
  expect(html).toBe('<div><h3>Hello</h3><b>Mid</b></div>')
})


test('passtrough scripts', () => {
  const html = render(`
    <body>
      <script src="/analytics.js"></script>
      <script type="module">track(666)</script>
      <script>// ignored</script>
    </body>
  `)
  expect(html).toInclude('analytics.js')
  expect(html).toInclude('type="module')
})


test('render functions', () => {
  const custom = (data) => `<h1>${ data.hello }, ${ data.who }</h1>`
  const template = `<div><custom hello="Hello"/></div>`
  const html = render(template, { who: 'World'}, { fns: { custom } })
  expect(html).toBe('<div><h1>Hello, World</h1></div>')
})


test('JSON stubs', () => {
  const template = `<div><foo hello="Hello"/></div>`
  const html = render(template)
  expect(html).toInclude('<foo custom="foo">')
  expect(html).toInclude('<script type="application/json">{"hello":"Hello"}')
})