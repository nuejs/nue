
import { clickable } from './event.util.js'
import { render } from '../src/index.js'

test('loop index', () => {
  const template = '<ul><li :each="(el, i) in items">${i}: ${el}</li></ul>'
  const html = render(template, { items: ['a', 'b'] })
  expect(html).toBe('<ul><li>0: a</li><li>1: b</li></ul>')
})

test('loop data access', () => {
  const template = '<div><p :each="el in items">${el} ${foo}</p></div>'
  const html = render(template, { foo: 1, items: ['F', 'F'] })
  expect(html).toInclude('<p>F 1</p><p>F 1</p>')
})

test('template loop', () => {
  const template = `
    <dl>
      <template :each="(el, i) in meta">
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
      <template :each="[key, val] in Object.entries(items)">
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
      <template :each="{ key, val } in items">
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
      <li :each="arr in items">
        <p :each="el in arr">\${ el }</p>
      </li>
    </ul>
  `
  const items = [['A', 'B'], ['C', 'D']]
  const html = render(template, { items })
  expect(html).toBe('<ul><li><p>A</p><p>B</p></li><li><p>C</p><p>D</p></li></ul>')
})

test('component loop', () => {
  const template = `
    <ul>
      <item :each="text of arr" :text="\${ text }"/>
      <script>
        this.arr = ['hello', 'world']
      </script>
    </ul>

    <li :is="item">\${ text }</li>
  `
  const html = render(template)
  expect(html).toBe('<ul><li>hello</li><li>world</li></ul>')
})


test('slot loop', () => {
  const html = render(`
    <a>
      <child :each="el, i in new Array(2).fill(1)">\${i}</child>
    </a>
    <b :is="child">i: <slot/></b>
  `)
  expect(html).toBe('<a><b>i: 0</b><b>i: 1</b></a>')
})

test('loop + if', () => {
  const template = `
    <div>
      <a :each="val in [1,2]" :if="doit">\${val}</a>
      <button :onclick="doit = true"/>
    </div>
  `
  const root = clickable(template)
  expect(root.html).toBe('<div><button></button></div>')

  root.click()
  expect(root.html).toInclude('<a>1</a><a>2</a>')
})

test.skip('loop :onclick', () => {
  const template = `
    <div>
      <button :each="el, i of [{ id: 2 }]" :onclick="doit = true">
        \${ el.id } / \${ i }
      </button>

      <p :if="doit">Hey</p>
    </div>
  `
  const root = clickable(template)
  expect(root.html).toEndWith('</button></div>')
  root.click()
  expect(root.html).toBe('<div><button>2 / 0</button><p>Hey</p></div>')
})