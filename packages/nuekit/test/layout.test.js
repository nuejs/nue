
// content collection rendering
import { renderListItem } from '../src/layout/pagelist.js'

import { renderHead } from '../src/layout/head.js'

import {
  parseClass,
  renderExpandable,
  parseNavItem,
  renderNavItem,
  renderNavItems,
  renderNavBlocks,

} from '../src/layout/navi.js'


test('pagelist: render single page', () => {
  const html = renderListItem({
    desc: 'Wassup *bro*',
    title: 'Yo',
    url: '/bruh/'
  })

  expect(html).toStartWith('<li class="is-new"><time datetime="')
  expect(html).toInclude('<a href="/bruh/"><h2>Yo</h2>')
  expect(html).toEndWith('<p>Wassup <em>bro</em></p></a></li>')
})


test('pagelist: render page with a thumb', () => {
  const html = renderListItem({ title: 'Yo', thumb: 'thumb.png', url: '/' })
  expect(html).toStartWith('<li class="is-new"><a href="/"><figure><img')
  expect(html).toEndWith('</figure></a></li>')
})


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


/***** Navigation tests ****/


test('navi: class shortcut', () => {
  expect(parseClass('/foo "bar"')).toEqual({ url: "/foo", class: "bar" })
})

test('navi: plain string', () => {
  expect(parseNavItem('FAQ')).toEqual({ text: "FAQ", url: "" })
  expect(parseNavItem('---')).toEqual({ separator: '---' })
})

test('navi: object', () => {
  expect(parseNavItem({ FAQ: '/en/faq' })).toEqual({ text: "FAQ", url: "/en/faq" })
  expect(parseNavItem({ FAQ: { foo: 1, bar: 'baz' }})).toEqual({ text: "FAQ", foo: 1, bar: 'baz' })
})

test('navi: array', () => {
  const item = parseNavItem({ Company: ['About', 'Blog'] })

  expect(item.text).toBe('Company')

  expect(item.items).toEqual([
    { text: "About", url: "", },
    { text: "Blog", url: "", }
  ])
})

test('render item', () => {
  const item = { text: 'FAQ', url: '/faq' }
  expect(renderNavItem(item)).toBe('<a href="/faq">FAQ</a>')
})

test('render image', () => {
  const item = { url: '/foo', image: 'book.jpg', size: '1 x 1' }
  const html = renderNavItem(item)
  expect(html).toBe('<a href="/foo"><img src="book.jpg" width="1" height="1"></a>')
})


test('render text', () => {
  const el = renderNavItem({ text: 'Yo, *rap*' })
  expect(el).toBe('<span>Yo, <em>rap</em></span>')
})

test('navi: render text and image', () => {
  const el = renderNavItem({ text: 'Adam', image: 'adam.jpg' })
  expect(el).toStartWith('<span><img src="adam.jpg">')
  expect(el).toEndWith('<strong>Adam</strong></span>')
})

test('navi: render url, text, image', () => {
  const el = renderNavItem({ url: '/', text: 'Adam', image: 'adam.jpg' })
  expect(el).toStartWith('<a href="/"><img')
  // expect(el).toEndWith('<span>Adam</span></span>')
})


test('render nav items', () => {
  const nav = renderNavItems(['a', 'b'])
  expect(nav).toStartWith('<nav><a>a</a>')
  const nav2 = renderNavItems(['a'], { label: 'main' })
  expect(nav2).toBe('<nav aria-label="main"><a>a</a></nav>')
})


test('render expandable nav items', () => {
  const nav = renderExpandable('Hey', ['a'])
  expect(nav).toStartWith('<span aria-haspopup><a aria-expanded="false">Hey</a>')
  expect(nav).toEndWith('<nav><a>a</a></nav></span>')
})

test('hybrid nav with expandable', () => {
  const nav = renderNavItems(['Docs', { 'More': ['a', 'b'] }])
  expect(nav).toStartWith('<nav><a>Docs</a>')
  expect(nav).toInclude('<span aria-haspopup><a aria-expanded="false">More</a><nav><a>a</a>')
})

test('nav blocks', () => {
  const nav = renderNavBlocks({ Basics: ['a']})
  expect(nav).toStartWith('<div><nav><h3>Basics</h3>')
  expect(nav).toEndWith('<a>a</a></nav></div>')
})




