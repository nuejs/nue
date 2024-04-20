
import { renderPage as renderArticle } from 'nuemark'
import { parse as parseNue } from 'nuejs-core'
import { renderHead } from './head.js'
import { renderNav } from './navi.js'

// default layouts
const HEADER = `
  <header>
    <navi :items="header.branding"/>
    <navi :items="header.navi"/>
    <navi :items="header.toolbar"/>
    <button type="button" aria-expanded="false" :if="header.burger_menu"/>
  </header>
`

const FOOTER = `
  <footer>
    <navi :items="footer.branding"/>
    <navi :items="footer.navi"/>
    <navi :items="footer.toolbar"/>
  </footer>
`

const MAIN = `
  <main>
    <slot for="layout.sidebar"/>
    <article>
      <slot for="layout.article"/>
    </article>
    <slot for="layout.aside"/>
  </main>
`

const system_lib = [
  {
    // navi tag
    name: 'navi',
    create({ items }) {
      return items?.length ? renderNav(items) : ''
    }
  }
]

export function renderPage(data, lib) {


  function renderBlock(compName, html) {
    let comp = lib.find(el => [el.name, el.tagName].includes(compName))
    if (!comp && html) comp = parseNue(html)[0]

    try {
      return comp ? comp.render(data, [...system_lib, ...lib]) : ''
    } catch (e) {
      delete data.inline_css
      console.error(`Error on <${compName}> component`)
      throw { component: compName, ...e }
    }
  }


  data.layout = {
    head: renderHead(data),
    article: renderArticle(data.page, { data, lib }).html,
    header: renderBlock('header', data.header && HEADER),
    footer: renderBlock('footer', data.header && FOOTER),
    sidebar: renderBlock('sidebar'),
    aside: renderBlock('aside'),
    custom_head: renderBlock('head').slice(6, -7),
  }

  data.layout.main = renderBlock('main', MAIN)
  const html = renderRootHTML(data)

  return renderBlock('html', html)
}

export function renderRootHTML(data) {
  const { language='en-US', direction='ltr' } = data
  const klass = data.class ? ` class="${data.class}"` : ''

  return `
<html lang="${language}" dir="${direction}">

  <head>
    <slot for="layout.head"/>
    <slot for="layout.custom_head"/>
  </head>

  <body${klass}>
    <slot for="layout.header"/>
    <slot for="layout.main"/>
    <slot for="layout.footer"/>
  </body>

</html>
`
}

export function renderSinglePage(body='', data) {
  const { language='en-US', direction='ltr' } = data

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

