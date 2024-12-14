
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
    { name: 'beside' },
    { name: 'hero', tagName: 'header' },
    { tagName: 'header' },
  ]

  expect(findComponent('beside', lib).name).toBe('beside')
  expect(findComponent('header', lib).name).toBeUndefined()

})

test('renderSlots', () => {
  const lib = [
    { name: 'head', render: () => '<head><meta></head>' },
    { name: 'banner', render: () => '<banner>' },
    { name: 'beside', render: () => '<aside>' },
  ]

  const slots = renderSlots({ beside: false }, lib)
  expect(slots).toEqual({ head: "<meta>", banner: "<banner>" })
})


test('renderPage', () => {
  const document = { render: () => '<h1>Hello</h1>' }
  const lib = [{ tagName: 'header', render: () => '<header>' }]
  const html = renderPage({ document, lib, data: { language: 'fi' }})
  expect(html).toStartWith('<html lang="fi" dir="ltr">')
  expect(html).toInclude('<header></header>')
  expect(html).toInclude('<h1>Hello</h1>')
})

test('getSPALayout', () => {
  const html = getSPALayout('<app/>', { title: 'Hey' })
  expect(html).toInclude('<title>Hey</title>')
  expect(html).toInclude('<app/>')
})





