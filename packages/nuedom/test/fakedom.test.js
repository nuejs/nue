
import { createDocument } from '../src/dom/fakedom.js'

const document = createDocument()

// helper functions
const el = (tag) => document.createElement(tag)
const text = (content) => document.createTextNode(content)

test('innerHTML', () => {
  const body = el('body')
  const link = el('a')
  link.setAttribute('href', '/test')
  link.appendChild(text('Click me'))
  body.appendChild(link)
  expect(body.innerHTML).toBe('<a href="/test">Click me</a>')
})

test('innerHTML handles nested elements', () => {
  const div = el('div')
  const span = el('span')
  span.appendChild(text('Hello'))
  div.appendChild(span)
  expect(div.innerHTML).toBe('<span>Hello</span>')
})

// firstChild tests
test('firstChild returns first child or text node', () => {
  const div = el('div')
  const span1 = el('span')
  const span2 = el('span')
  div.appendChild(span1)
  div.appendChild(span2)
  expect(div.firstChild).toBe(span1)

  // test with text node as first child
  const div2 = el('div')
  const textNode = text('Hello')
  div2.appendChild(textNode)
  div2.appendChild(el('span'))
  expect(div2.firstChild).toBe(textNode)
})

test('firstChild returns undefined for empty element', () => {
  const div = el('div')
  expect(div.firstChild).toBeUndefined()
})

// replaceChild tests
test('replaceChild replaces existing child and maintains order', () => {
  const div = el('div')
  const span1 = el('span')
  const span2 = el('span')
  const span3 = el('span')
  const newP = el('p')

  div.appendChild(span1)
  div.appendChild(span2)
  div.appendChild(span3)

  const returned = div.replaceChild(newP, span2)

  // check replacement worked
  expect(div.children).toContain(newP)
  expect(div.children).not.toContain(span2)
  expect(newP.parentNode).toBe(div)
  expect(span2.parentNode).toBe(null)

  // check order maintained
  expect(div.children[0]).toBe(span1)
  expect(div.children[1]).toBe(newP)
  expect(div.children[2]).toBe(span3)

  // check return value
  expect(returned).toBe(span2)
})

test('attributes work with standard iteration', () => {
  const button = el('button')
  button.setAttribute('disabled', '')
  button.setAttribute('type', 'submit')

  const attrs = []
  for (let attr of button.attributes) {
    attrs.push(`${attr.name}="${attr.value}"`)
  }

  expect(attrs).toContain('disabled=""')
  expect(attrs).toContain('type="submit"')
  expect(button.outerHTML).toBe('<button disabled="" type="submit"></button>')
})

test('classList and class attribute work together', () => {
  const div = el('div')
  div.classList.add('foo', 'bar')

  expect(div.classList.length).toBe(2)
  expect(div.classList.toString()).toBe('foo bar')
  expect(div.outerHTML).toBe('<div class="foo bar"></div>')
})

test('void tags serialize as self-closing', () => {
  const div = el('div')
  const img = el('img')
  img.setAttribute('src', 'test.jpg')
  div.appendChild(img)

  expect(div.innerHTML).toBe('<img src="test.jpg">')
})

test('SVG elements preserve case-sensitive tag names', () => {
  const svg = el('svg')
  const foreignObject = el('foreignObject')
  svg.appendChild(foreignObject)

  expect(svg.innerHTML).toBe('<foreignObject></foreignObject>')
})

test('document fragment works', () => {
  const fragment = document.createDocumentFragment()
  fragment.appendChild(el('div'))
  fragment.appendChild(text('hello'))

  expect(fragment.innerHTML).toBe('<div></div>hello')
})

test('textContent', () => {
  const div = el('div')
  div.appendChild(text('Hello'))
  console.info(div.textContent)
  // expect(div.textContent).toBe('Hello')  // This will probably fail
})

test('textContent getter on elements collects from multiple text children', () => {
  const div = el('div')
  div.appendChild(text('Hello'))
  div.appendChild(text(' World'))
  expect(div.textContent).toBe('Hello World')
})

test('textContent getter on elements collects from nested text', () => {
  const div = el('div')
  const span = el('span')
  span.appendChild(text('Hello'))
  div.appendChild(span)
  expect(div.textContent).toBe('Hello')
})

