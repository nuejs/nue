
import { createDocument } from '../src/dom/fakedom.js'
import { domdiff } from '../src/dom/diff.js'

// helper functions
const text = (content) => document.createTextNode(content)

const div = (content) => {
  const el = document.createElement('div')
  if (content) el.appendChild(text(content))
  return el
}

const span = (content) => {
  const el = document.createElement('span')
  if (content) el.appendChild(text(content))
  return el
}

const p = (content) => {
  const el = document.createElement('p')
  if (content) el.appendChild(text(content))
  return el
}

const ul = () => document.createElement('ul')

const li = (content, key) => {
  const el = document.createElement('li')
  if (content) el.appendChild(text(content))
  if (key) el.setAttribute('key', key)
  return el
}

beforeAll(() => global.document = createDocument() )

test('text update', () => {
  const oldDiv = div('1')
  const newDiv = div('2')

  domdiff(oldDiv, newDiv)
  expect(oldDiv.textContent).toBe('2')
})

test('attribute update', () => {
  const oldDiv = div()
  oldDiv.setAttribute('class', 'old')
  const newDiv = div()
  newDiv.setAttribute('class', 'new')

  domdiff(oldDiv, newDiv)
  expect(oldDiv.getAttribute('class')).toBe('new')
})

test('attribute addition', () => {
  const oldDiv = div()
  const newDiv = div()
  newDiv.setAttribute('id', 'test')

  domdiff(oldDiv, newDiv)
  expect(oldDiv.getAttribute('id')).toBe('test')
})

test('attribute removal', () => {
  const oldDiv = div()
  oldDiv.setAttribute('id', 'test')
  const newDiv = div()

  domdiff(oldDiv, newDiv)
  expect(oldDiv.hasAttribute('id')).toBe(false)
})

test('element addition', () => {
  const oldDiv = div()
  const newDiv = div()
  newDiv.appendChild(span('New'))

  domdiff(oldDiv, newDiv)
  expect(oldDiv.children.length).toBe(1)
  expect(oldDiv.firstChild.tagName).toBe('SPAN')
  expect(oldDiv.textContent).toBe('New')
})

test('element removal', () => {
  const oldDiv = div()
  oldDiv.appendChild(span('Old'))
  const newDiv = div()

  domdiff(oldDiv, newDiv)
  expect(oldDiv.children.length).toBe(0)
})

test('multiple element addition', () => {
  const oldDiv = div()
  const newDiv = div()
  newDiv.appendChild(span('A'))
  newDiv.appendChild(p('B'))

  domdiff(oldDiv, newDiv)
  expect(oldDiv.children.length).toBe(2)
  expect(oldDiv.children[0].tagName).toBe('SPAN')
  expect(oldDiv.children[0].textContent).toBe('A')
  expect(oldDiv.children[1].tagName).toBe('P')
  expect(oldDiv.children[1].textContent).toBe('B')
})

test('multiple element removal', () => {
  const oldDiv = div()
  oldDiv.appendChild(span('A'))
  oldDiv.appendChild(p('B'))
  const newDiv = div()

  domdiff(oldDiv, newDiv)
  expect(oldDiv.children.length).toBe(0)
})

test('element reorder', () => {
  const oldDiv = div()
  oldDiv.appendChild(span('A'))
  oldDiv.appendChild(p('B'))

  const newDiv = div()
  newDiv.appendChild(p('B'))
  newDiv.appendChild(span('A'))

  domdiff(oldDiv, newDiv)
  expect(oldDiv.children[0].tagName).toBe('P')
  expect(oldDiv.children[0].textContent).toBe('B')
  expect(oldDiv.children[1].tagName).toBe('SPAN')
  expect(oldDiv.children[1].textContent).toBe('A')
})

test('keyed list reorder', () => {
  const oldUl = ul()
  oldUl.appendChild(li('A', '1'))
  oldUl.appendChild(li('B', '2'))

  const newUl = ul()
  newUl.appendChild(li('B', '2'))
  newUl.appendChild(li('A', '1'))

  domdiff(oldUl, newUl)
  expect(oldUl.children[0].getAttribute('key')).toBe('2')
  expect(oldUl.children[0].textContent).toBe('B')
  expect(oldUl.children[1].getAttribute('key')).toBe('1')
  expect(oldUl.children[1].textContent).toBe('A')
})

test('keyed list addition', () => {
  const oldUl = ul()
  oldUl.appendChild(li('A', '1'))

  const newUl = ul()
  newUl.appendChild(li('A', '1'))
  newUl.appendChild(li('B', '2'))

  domdiff(oldUl, newUl)
  expect(oldUl.children.length).toBe(2)
  expect(oldUl.children[0].getAttribute('key')).toBe('1')
  expect(oldUl.children[0].textContent).toBe('A')
  expect(oldUl.children[1].getAttribute('key')).toBe('2')
  expect(oldUl.children[1].textContent).toBe('B')
})

test('keyed list removal', () => {
  const oldUl = ul()
  oldUl.appendChild(li('A', '1'))
  oldUl.appendChild(li('B', '2'))

  const newUl = ul()
  newUl.appendChild(li('A', '1'))

  domdiff(oldUl, newUl)
  expect(oldUl.children.length).toBe(1)
  expect(oldUl.children[0].getAttribute('key')).toBe('1')
  expect(oldUl.children[0].textContent).toBe('A')
})

test('nested element update', () => {
  const oldDiv = div()
  oldDiv.appendChild(span('Hello'))

  const newDiv = div()
  newDiv.appendChild(span('World'))

  domdiff(oldDiv, newDiv)
  expect(oldDiv.children[0].textContent).toBe('World')
})

test('nested element addition', () => {
  const oldDiv = div()
  oldDiv.appendChild(span('A'))

  const newDiv = div()
  newDiv.appendChild(span('A'))
  const nested = div()
  nested.appendChild(p('B'))
  newDiv.appendChild(nested)

  domdiff(oldDiv, newDiv)
  expect(oldDiv.children.length).toBe(2)
  expect(oldDiv.children[0].tagName).toBe('SPAN')
  expect(oldDiv.children[0].textContent).toBe('A')
  expect(oldDiv.children[1].tagName).toBe('DIV')
  expect(oldDiv.children[1].children[0].tagName).toBe('P')
  expect(oldDiv.children[1].children[0].textContent).toBe('B')
})

test('text node addition', () => {
  const oldDiv = div()
  const newDiv = div('Hello')

  domdiff(oldDiv, newDiv)
  expect(oldDiv.textContent).toBe('Hello')
})

test('text node removal', () => {
  const oldDiv = div('Hello')
  const newDiv = div()

  domdiff(oldDiv, newDiv)
  expect(oldDiv.textContent).toBe('')
})

test('mixed content update', () => {
  const oldDiv = div()
  oldDiv.appendChild(text('Hello'))
  oldDiv.appendChild(span('A'))

  const newDiv = div()
  newDiv.appendChild(text('World'))
  newDiv.appendChild(span('B'))

  domdiff(oldDiv, newDiv)
  expect(oldDiv.childNodes[0].textContent).toBe('World')
  expect(oldDiv.childNodes[1].tagName).toBe('SPAN')
  expect(oldDiv.childNodes[1].textContent).toBe('B')
})

test('complete node replacement', () => {
  const parent = div()
  const oldDiv = div()
  oldDiv.appendChild(span('A'))
  parent.appendChild(oldDiv)

  const newDiv = div()
  newDiv.appendChild(p('B'))

  domdiff(oldDiv, newDiv)
  expect(parent.children[0].tagName).toBe('DIV')
  expect(parent.children[0].children[0].tagName).toBe('P')
  expect(parent.children[0].children[0].textContent).toBe('B')
})