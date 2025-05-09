
// content collection rendering
import { findComponent, renderSlots, renderPage, getSPALayout } from '../src/layout/page.js'
import { renderHead } from '../src/layout/head.js'


test('<head>', () => {
  const head = renderHead({ charset: 'foo', title: 'Hey' })
  expect(head).toInclude('meta charset="foo"')
  expect(head).toInclude('<title>Hey</title>')
  expect(head).toInclude('"nue:components" content=" "')
  // expect(head).toInclude('<link rel="preload" as="image" href="hey.png">')
})

test('prefetch', () => {
  const head = renderHead({ prefetch: ['hey.png', 'foo.css'] })
  expect(head).toInclude('<link href="hey.png" rel="preload" as="image">')
  expect(head).toInclude('<link href="foo.css" rel="prefetch">')
})

test('findComponent', () => {
  const lib = [
    { is: 'beside' },
    { is: 'hero', tag: 'header' },
    { tag: 'header' },
  ]
  expect(findComponent('beside', lib).is).toBe('beside')
  expect(findComponent('header', lib).is).toBeUndefined()
})


test('renderPage', () => {
  const document = { render: () => '<h1>Hello</h1>' }
  const html = renderPage({ language: 'fi', document }, [])
  expect(html).toStartWith('<html lang="fi">')
  expect(html).toInclude('<h1>Hello</h1>')
})

test('getSPALayout', () => {
  const html = getSPALayout('<app/>', { title: 'Hey' })
  expect(html).toInclude('<title>Hey</title>')
  expect(html).toInclude('<app/>')
})





