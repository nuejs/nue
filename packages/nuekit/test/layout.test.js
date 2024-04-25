
// content collection rendering
import { renderPage, renderPageList } from '../src/layout/pagelist.js'

import { renderHead } from '../src/layout/head.js'

import {
  parseDescription,
  renderExpandable,
  parseNavItem,
  renderNavItem,
  renderNavItems,
  renderNavBlocks,

} from '../src/layout/navi.js'



test('render page', () => {
  const html = renderPage({
    title: 'Yo',
    desc: 'Wassup *bro*',
    url: '/bruh/'
  })

  expect(html).toStartWith('<li class="is-new"><time datetime="')
  expect(html).toInclude('<a href="/bruh/"><h2>Yo</h2>')
  expect(html).toEndWith('<p>Wassup <em>bro</em></p></a></li>')
})

test.only('render pages', () => {
  const page = { title: 'Yo', desc: 'Bro', url: '/'}
  const html = renderPageList({ items: [page, page] })
  expect(html).toStartWith('<ul><li')
  expect(html.length).toBeGreaterThan(250)
})

test('<head>', () => {
  const head = renderHead({ charset: 'foo', title: 'Hey', preload_image: 'hey.png' })
  expect(head).toInclude('meta charset="foo"')
  expect(head).toInclude('<title>Hey</title>')
  expect(head).toInclude('<link rel="preload" as="image" href="hey.png">')
})


test('description', () => {
  expect(parseDescription('About "We"')).toEqual({ url: "About", desc: "We" })
})

test('navi string', () => {
  expect(parseNavItem('FAQ')).toEqual({ label: "FAQ", url: "/faq/" })
  expect(parseNavItem('---')).toEqual({ separator: '---' })
})

test('navi object', () => {
  expect(parseNavItem({ FAQ: '/en/faq' })).toEqual({ label: "FAQ", url: "/en/faq" })
  expect(parseNavItem({ FAQ: { foo: 1, bar: 'baz' }})).toEqual({ label: "FAQ", foo: 1, bar: 'baz' })
})

test('navi array', () => {
  const item = parseNavItem({ Company: ['About', 'Blog'] })

  expect(item.label).toBe('Company')

  expect(item.items).toEqual([
    { label: "About", url: "/about/", },
    { label: "Blog", url: "/blog/", }
  ])
})

test('render item', () => {
  const item = { label: 'FAQ', url: '/faq' }
  expect(renderNavItem(item)).toBe('<a href="/faq">FAQ</a>')
})

test('render icon', () => {
  const item = { url: '/foo', icon: 'book', width: 32 }
  const icon = renderNavItem(item)
  expect(icon).toStartWith('<a href="/foo"><img src="/img/book.svg"')
  expect(icon).toInclude('width="32"')
  expect(icon).toInclude('height="32"')

  // nested content
  const icon2 = renderNavItem({ label: 'Yo', ...item })
  expect(icon2).toEndWith('<span>Yo</span></a>')
})

test('render image', () => {
  const img = renderNavItem({ image: '/bar', size: '100 x 50' })
  expect(img).toBe('<p><img src="/bar" width="100" height="50"></p>')
})


test('render label', () => {
  const el = renderNavItem({ label: 'Yo, *rap*' })
  expect(el).toBe('<p>Yo, <em>rap</em></p>')
})


test('render nav items', () => {
  const nav = renderNavItems(['a', 'b'])
  expect(nav).toStartWith('<nav><a href="/a/">a')
  const nav2 = renderNavItems(['a'], { label: 'main' })
  expect(nav2).toStartWith('<nav aria-label="main">')
})


test('render expandable nav items', () => {
  const nav = renderExpandable('Hey', ['a'])
  expect(nav).toStartWith('<span aria-haspopup><a aria-expanded="false">Hey</a>')
  expect(nav).toEndWith('<nav><a href="/a/">a</a></nav></span>')
})

test('hybrid nav with expandable', () => {
  const nav = renderNavItems(['Docs', { 'More': ['a', 'b'] }])
  expect(nav).toStartWith('<nav><a href="/docs/">Docs</a>')
  expect(nav).toInclude('<span aria-haspopup><a aria-expanded="false">More</a><nav><a href="/a/">a</a>')
})

test('nav blocks', () => {
  const nav = renderNavBlocks({ Basics: ['a']})
  expect(nav).toStartWith('<section><nav><h3>Basics</h3>')
  expect(nav).toEndWith('<a href="/a/">a</a></nav></section>')
})




