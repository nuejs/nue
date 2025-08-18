
import { createWindow } from 'domino'

import { toRelative, updateContent, findNewStyles } from '../client/transitions.js'

test('toRelative', () => {
  global.location = { pathname: '/current/path/' }
  expect(toRelative('about.html')).toBe('/current/path/about.html')
  expect(toRelative('docs/guide')).toBe('/current/path/docs/guide')
})

test('updateContent', () => {
  const doc = createWindow().document

  // Missing elements
  expect(updateContent(null, doc.createElement('div'))).toBe(true)
  expect(updateContent(doc.createElement('div'), null)).toBe(true)

  // Same structure
  const current = doc.createElement('div')
  const incoming = doc.createElement('div')
  current.innerHTML = '<p></p><span></span>'
  incoming.innerHTML = '<p></p><span></span>'
  expect(updateContent(current, incoming)).toBe(true)

  // Different structure
  incoming.innerHTML = '<p></p><div></div>'
  expect(updateContent(current, incoming)).toBe(false)
})

test('updateContent: changes in body', () => {
  const doc = createWindow().document

  // Realistic case: body structure changes
  const currentBody = doc.createElement('body')
  const incomingBody = doc.createElement('body')

  currentBody.innerHTML = '<header>Header</header><main>Main content</main>'
  incomingBody.innerHTML = '<main>Different main content</main>'

  // Different structure should trigger innerHTML replacement
  updateContent(currentBody, incomingBody)
  expect(currentBody.innerHTML).toBe('<main>Different main content</main>')
})


test('findNewStyles', () => {
  const doc = createWindow().document

  // Current styles
  const oldStyle = doc.createElement('link')
  oldStyle.setAttribute('href', '/old.css')
  const sharedStyle = doc.createElement('link')
  sharedStyle.setAttribute('href', '/shared.css')
  const current = [oldStyle, sharedStyle]

  // Incoming styles
  const newStyle = doc.createElement('link')
  newStyle.setAttribute('href', '/new.css')
  const sharedStyle2 = doc.createElement('link')
  sharedStyle2.setAttribute('href', '/shared.css')
  const incoming = [newStyle, sharedStyle2]

  const newStyles = findNewStyles(current, incoming)

  // Old style should be disabled
  expect(oldStyle.disabled).toBe(true)
  // Shared style should remain enabled
  expect(sharedStyle.disabled).toBe(false)
  // Should return only the new style
  expect(newStyles).toEqual([newStyle])
})