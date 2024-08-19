
// Standardized page layout / "Modern-day CSS Zen Garden"

import { renderGallery, renderPrettyDate } from './gallery.js'
import { renderNav, renderTOC } from './navi.js'
import { renderPage as nuemark } from 'nuemark'
import { parse as parseNue } from 'nuejs-core'
import { renderInline } from 'nuemark'
import { renderHead } from './head.js'

const HEADER = `
  <header>
    <navi :for="[label, items] of Object.entries(header)" :label :items/>
    <button popovertarget="menu" :if="burger_menu"/>
  </header>
`

const FOOTER = `
  <footer>
    <navi :for="[label, items] of Object.entries(footer)" :label :items/>
  </footer>
`

const MAIN = `
  <main>
    <slot for="layout.aside"/>

    <article>
      <slot for="layout.pagehead"/>
      <slot for="layout.article"/>
      <slot for="layout.pagefoot"/>
    </article>

    <slot for="layout.complementary"/>
  </main>
`

const MENU = `
  <!-- burger menu -->
  <dialog popover id="menu">
    <button popovertarget="menu">&times;</button>
    <navi :items="burger_menu"/>
  </dialog>
`

export function renderRootHTML(data) {
  const { language = 'en-US', direction = 'ltr' } = data
  const body_class = data.class ? ` class="${data.class}"` : ''

  return `
<html lang="${language}" dir="${direction}">

  <head>
    <slot for="layout.head"/>
    <slot for="layout.custom_head"/>
  </head>

  <body${body_class}>
    <slot for="layout.banner"/>
    <slot for="layout.header"/>
    <slot for="layout.subheader"/>

    <slot for="layout.main"/>

    <slot for="layout.footer"/>
    <slot for="layout.bottom"/>
    <slot for="layout.menu"/>
  </body>

</html>
`
}

export function renderSinglePage(body = '', data) {
  const { language = 'en-US', direction = 'ltr' } = data

  data.layout = { head: renderHead(data) }

  return `
<html lang="${language}" dir="${direction}">
  <head>
    <slot for="layout.head"/>
  </head>

  <body>
    ${body}
  </body>
</html>
`
}

// system components
const html_tags = [
  { name: 'navi', create: renderNav },
  { name: 'gallery', create: renderGallery },
  { name: 'markdown', create: ({ content }) => renderInline(content) },
  { name: 'pretty-date', create: ({ date }) => renderPrettyDate(date) },
  { name: 'toc', create: renderTOC },
]

const nuemark_tags = { gallery: renderGallery, toc: renderTOC }

export function renderPage(data, lib) {

  function renderBlock(name, html) {

    if (data[name] === false || data[name.slice(1)] === false) return null

    let comp = lib.find(el => name[0] == '@' ? el.name == name.slice(1) : !el.name && el.tagName == name)

    if (!comp && html) comp = parseNue(html)[0]

    try {
      return comp ? comp.render(data, [...html_tags, ...lib]) : ''
    } catch (e) {
      delete data.inline_css
      console.error(`Error on <${name}> component`, e)
      throw { component: name, ...e }
    }
  }

  data.layout = {
    head: renderHead(data),
    custom_head: renderBlock('head').slice(6, -7),
    article: nuemark(data.page, { data, lib, tags: nuemark_tags, draw_sections: true }).html,
    banner: renderBlock('@banner'),
    header: renderBlock('header', data.header && HEADER),
    subheader: renderBlock('@subheader'),

    footer: renderBlock('footer', data.footer && FOOTER),

    aside: renderBlock('aside'),
    complementary: renderBlock('@complementary'),

    pagehead: renderBlock('@pagehead'),
    pagefoot: renderBlock('@pagefoot'),

    bottom: renderBlock('@bottom'),
    menu: renderBlock('@menu', data.burger_menu && MENU),
  }

  data.layout.main = renderBlock('main', MAIN)
  const html = renderRootHTML(data)

  return renderBlock('html', html)
}
