
import { render } from '../src'

jest.spyOn(console, 'error').mockImplementation(() => {})
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

test('errors', () => {
  const html = render('<div>${ foo() }</div>')
  expect(html).toBe('<div>[Error]</div>')
  expect(console.error).toHaveBeenCalled()
})

test('do not render event handlers', () => {
  const html = render('<a :click="click"></a>', { click: () => true })
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6 8a6 6 0 0 1 12"/>
    </svg>
  `
  const svg = render(template)

  expect(svg).toStartWith('<svg xmlns="http://www.w3.org/2000/svg"')
  expect(svg).toInclude('<path d="M6 8a6 6 0 0 1 12">')
})

test('interpolation', () => {
  const template = '<div class="item ${ type }"/>'
  const html = render(template, { type: 'active' })
  expect(html).toBe('<div class="item active"></div>')
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


test('loop', () => {
  const template = '<ul><li :for="(el, i) in items">${i}: ${el}</li></ul>'
  const html = render(template, { items: ['a', 'b'] })
  expect(html).toBe('<ul><li>0: a</li><li>1: b</li></ul>')
})

test('template loop', () => {
  const template = `
    <dl>
      <template :for="(el, i) in meta">
        <dt>\${ el.title }</dt>
        <dd>\${ el.data }</dd>
      </template>
    </dl>
  `
  const meta = [
    { title: 'Name', data: 'Alice' },
    { title: 'Age', data: '30' }
  ]

  const html = render(template, { meta })
  expect(html).toBe('<dl><dt>Name</dt><dd>Alice</dd><dt>Age</dt><dd>30</dd></dl>')
})

test('Object.entries()', () => {
  const template = `
    <dl>
      <template :for="[key, val] in Object.entries(items)">
        <td>\${ key }</td>
        <dd>\${ val }</dd>
      </template>
    </dl>
  `
  const items = { Email: 'm@example.com' }
  const html = render(template, { items })
  expect(html).toBe('<dl><td>Email</td><dd>m@example.com</dd></dl>')
})

test('loop deconstruct', () => {
  const template = `
    <dl>
      <template :for="{ key, val } in items">
        <td>\${ key }</td>
        <dd>\${ val }</dd>
      </template>
    </dl>
  `
  const items = [{ key: 'Email', val: 'm@example.com' }]
  const html = render(template, { items })
  expect(html).toBe('<dl><td>Email</td><dd>m@example.com</dd></dl>')
})

test('nested loop', () => {
  const template = `
    <ul>
      <li :for="arr in items">
        <p :for="el in arr">\${ el }</p>
      </li>
    </ul>
  `
  const items = [['A', 'B'], ['C', 'D']]
  const html = render(template, { items })
  expect(html).toBe('<ul><li><p>A</p><p>B</p></li><li><p>C</p><p>D</p></li></ul>')
})

test('loop data access', () => {
  const template = '<div><p :for="el in items">${el} ${foo}</p></div>'
  const html = render(template, { foo: 1, items: ['F', 'F'] })
  expect(html).toInclude('<p>F 1</p><p>F 1</p>')
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


test.only('JSON stubs', () => {
  const template = `<div><custom hello="Hello"/></div>`
  const html = render(template)
  console.info(html)
  // expect(html).toInclude('<script type="application/json" component="custom">')
  // expect(html).toInclude('{"hello":"Hello"}')
})