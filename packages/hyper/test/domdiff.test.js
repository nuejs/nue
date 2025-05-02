import { domdiff } from '../src/block/domdiff.js'
import domino from 'domino'

function createDOM(html) {
  const doc = domino.createDocument(html)
  return doc.body.firstChild
}

function testDiff(initialHTML, newHTML) {
  global.document = domino.createDocument()
  const oldNode = createDOM(initialHTML)
  const newNode = createDOM(newHTML)
  document.body.appendChild(oldNode)
  domdiff(oldNode, newNode, document.body, {})
  return oldNode.outerHTML.replace(/disabled="true"/g, 'disabled')
}


test('text update', () => {
  const result = testDiff('<div>1</div>', '<div>2</div>')
  expect(result).toBe('<div>2</div>')
})

test('text update', () => {
  const result = testDiff('<div>Hello</div>', '<div>World</div>')
  expect(result).toBe('<div>World</div>')
})

test('attribute update', () => {
  const result = testDiff('<div class="old"></div>', '<div class="new"></div>')
  expect(result).toBe('<div class="new"></div>')
})

test('attribute addition', () => {
  const result = testDiff('<div></div>', '<div id="test"></div>')
  expect(result).toBe('<div id="test"></div>')
})

test('attribute removal', () => {
  const result = testDiff('<div id="test"></div>', '<div></div>')
  expect(result).toBe('<div></div>')
})

test('element addition', () => {
  const result = testDiff('<div></div>', '<div><span>New</span></div>')
  expect(result).toBe('<div><span>New</span></div>')
})

test('element removal', () => {
  const result = testDiff('<div><span>Old</span></div>', '<div></div>')
  expect(result).toBe('<div></div>')
})

test('multiple element addition', () => {
  const result = testDiff('<div></div>', '<div><span>A</span><p>B</p></div>')
  expect(result).toBe('<div><span>A</span><p>B</p></div>')
})

test('multiple element removal', () => {
  const result = testDiff('<div><span>A</span><p>B</p></div>', '<div></div>')
  expect(result).toBe('<div></div>')
})

test('element reorder - positional', () => {
  const result = testDiff('<div><span>A</span><p>B</p></div>', '<div><p>B</p><span>A</span></div>')
  expect(result).toBe('<div><p>B</p><span>A</span></div>')
})

test('keyed list reorder', () => {
  const result = testDiff(
    '<ul><li key="1">A</li><li key="2">B</li></ul>',
    '<ul><li key="2">B</li><li key="1">A</li></ul>'
  )
  expect(result).toBe('<ul><li key="2">B</li><li key="1">A</li></ul>')
})

test('keyed list addition', () => {
  const result = testDiff(
    '<ul><li key="1">A</li></ul>',
    '<ul><li key="1">A</li><li key="2">B</li></ul>'
  )
  expect(result).toBe('<ul><li key="1">A</li><li key="2">B</li></ul>')
})

test('keyed list removal', () => {
  const result = testDiff(
    '<ul><li key="1">A</li><li key="2">B</li></ul>',
    '<ul><li key="1">A</li></ul>'
  )
  expect(result).toBe('<ul><li key="1">A</li></ul>')
})

test('mixed keyed and positional children', () => {
  const result = testDiff(
    '<div><span>A</span><p key="1">B</p></div>',
    '<div><p key="1">B</p><span>A</span></div>'
  )
  expect(result).toBe('<div><p key="1">B</p><span>A</span></div>')
})

test('nested element update', () => {
  const result = testDiff(
    '<div><span>Hello</span></div>',
    '<div><span>World</span></div>'
  )
  expect(result).toBe('<div><span>World</span></div>')
})

test('nested element addition', () => {
  const result = testDiff(
    '<div><span>A</span></div>',
    '<div><span>A</span><div><p>B</p></div></div>'
  )
  expect(result).toBe('<div><span>A</span><div><p>B</p></div></div>')
})

test('nested element removal', () => {
  const result = testDiff(
    '<div><span>A</span><div><p>B</p></div></div>',
    '<div><span>A</span></div>'
  )
  expect(result).toBe('<div><span>A</span></div>')
})

test('text node addition', () => {
  const result = testDiff('<div></div>', '<div>Hello</div>')
  expect(result).toBe('<div>Hello</div>')
})

test('text node removal', () => {
  const result = testDiff('<div>Hello</div>', '<div></div>')
  expect(result).toBe('<div></div>')
})

test('mixed content update', () => {
  const result = testDiff(
    '<div>Hello<span>A</span></div>',
    '<div>World<span>B</span></div>'
  )
  expect(result).toBe('<div>World<span>B</span></div>')
})

test('complete node replacement', () => {
  const result = testDiff(
    '<div><span>A</span></div>',
    '<div><p>B</p></div>'
  )
  expect(result).toBe('<div><p>B</p></div>')
})