
// tests for helper/core components
import {
  renderPage,
  parseClass,
  parseLink,
  renderNav,
  renderLink,
  renderMultiNav } from '../src/layout/components.js'


test('render page', () => {
  const html = renderPage({
    desc: 'Wassup *bro*',
    title: 'Yo',
    url: '/bruh/'
  })

  expect(html).toStartWith('<li class="is-new"><time datetime="')
  expect(html).toInclude('<a href="/bruh/"><h2>Yo</h2>')
  expect(html).toEndWith('<p>Wassup <em>bro</em></p></a></li>')
})


test('render page with a thumb', () => {
  const html = renderPage({ title: 'Yo', thumb: 'thumb.png', url: '/' })
  expect(html).toStartWith('<li class="is-new"><a href="/"><figure><img')
  expect(html).toEndWith('</figure></a></li>')
})


test('parse class', () => {
  expect(parseClass('/foo "bar"')).toEqual({ url: "/foo", class: "bar" })
})

test('parse link', () => {
  expect(parseLink({ FAQ: '/faq' })).toEqual({ label: "FAQ", url: "/faq" })
  expect(parseLink({ Hey: '/ "baz"' })).toEqual({ label: "Hey", url: '/', class: 'baz' })
})


test('parse link / plain string', () => {
  expect(parseLink('FAQ')).toEqual({ label: "FAQ", url: "" })
  expect(parseLink('---')).toEqual({ separator: '---' })
})

test('render link', () => {
  expect(renderLink({ 'Hey': '/' })).toBe('<a href="/">Hey</a>')
  expect(renderLink({ url: '/', label: 'Hey'})).toBe('<a href="/">Hey</a>')
})

test('render image link', () => {
  const html = renderLink({
    image: 'logo.svg',
    class: 'logo',
    alt: 'Nue logo',
    size: '60 × 18',
    url: '/',
  })

  expect(html).toStartWith('<a href="/" class="logo">')
  expect(html).toInclude('<img src="logo.svg" width="60" height="18" alt="Nue logo">')
})

test('render nav', () => {
  const items = [{ 'Hey': '/'}]
  const html = renderNav({ items })
  expect(html).toBe('<nav><a href="/">Hey</a></nav>')
})

test('render categorized nav', () => {
  const html = renderMultiNav({
    Hey: [{ Foo: '/'}],
    Foo: [{ Bar: '/'}],

  }, { class: 'epic' })

  expect(html).toStartWith('<div class="epic"><nav><h3>Hey</h3><a href="/">Foo</a></nav>')
  expect(html).toEndWith('<nav><h3>Foo</h3><a href="/">Bar</a></nav></div>')
})

