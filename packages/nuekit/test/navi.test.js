
import {
  parseDescription,
  parseNavItem,
  renderNavItem,
  renderNav,
  renderExpandableItem,

} from '../src/layout/navi.js'


test('description', () => {
  expect(parseDescription('About "We"')).toEqual({ url: "About", desc: "We" })
})

test('navi string', () => {
  expect(parseNavItem('FAQ')).toEqual({ text: "FAQ", url: "/faq/" })
  expect(parseNavItem('---')).toEqual({ separator: '---' })
})

test('navi object', () => {
  expect(parseNavItem({ FAQ: '/en/faq' })).toEqual({ text: "FAQ", url: "/en/faq" })
  expect(parseNavItem({ FAQ: { foo: 1, bar: 'baz' }})).toEqual({ text: "FAQ", foo: 1, bar: 'baz' })
})

test('navi array', () => {
  const item = parseNavItem({ Company: ['About', 'Blog'] })

  expect(item.text).toBe('Company')

  expect(item.items).toEqual([
    { text: "About", url: "/about/", },
    { text: "Blog", url: "/blog/", }
  ])
})

test('render item', () => {
  const item = { text: 'FAQ', url: '/faq' }
  expect(renderNavItem(item)).toBe('<a href="/faq">FAQ</a>')
})

test('render icon', () => {
  const item = { url: '/foo', icon: 'book', width: 32 }
  const icon = renderNavItem(item)
  expect(icon).toStartWith('<a href="/foo"><img src="/img/book.svg"')
  expect(icon).toInclude('width="32"')
  expect(icon).toInclude('height="32"')

  // nested content
  const icon2 = renderNavItem({ text: 'Yo', ...item })
  expect(icon2).toEndWith('<span>Yo</span></a>')
})

test('render image', () => {
  const img = renderNavItem({ image: '/bar', size: '100 x 50' })
  expect(img).toBe('<p><img src="/bar" width="100" height="50"></p>')
})


test('render text', () => {
  const el = renderNavItem({ text: 'Yo, *rap*' })
  expect(el).toBe('<p>Yo, <em>rap</em></p>')
})


test('render nav', () => {
  const nav = renderNav({ items: ['a', 'b']})
  expect(nav).toStartWith('<nav><a href="/a/">a')

  const nav2 = renderNav({ text: 'Hey', items: ['a'] })
  expect(nav2).toStartWith('<nav aria-label="Hey"><h3>Hey</h3>')
})


test('render expandable item', () => {
  const item = renderExpandableItem({ text: 'Hey', items: ['a'] })
  expect(item).toStartWith('<span aria-haspopup><a aria-expanded="false">Hey</a>')
  expect(item).toEndWith('<nav><a href="/a/">a</a></nav></span>')
})

//