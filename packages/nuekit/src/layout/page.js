
import { renderPageList, renderPrettyDate } from './pagelist.js'
import { renderPage as nuemark } from 'nuemark'
import { parse as parseNue } from 'nuejs-core'
import { renderInline } from 'nuemark'
import { renderHead } from './head.js'
import { renderNav } from './navi.js'

// default layouts
const HEADER = `
  <header>
    <navi :items="header.branding" label="branding"/>
    <navi :items="header.navi" label="main"/>
    <navi :items="header.toolbar" label="toolbar"/>
    <a href="#menu" aria-controls="menu" :if="header.burger_menu"/>
  </header>
`

const FOOTER = `
  <footer>
    <navi :items="footer.branding" label="branding"/>
    <navi :items="footer.navi"/>
    <navi :items="footer.toolbar" label="toolbar"/>
  </footer>
`

const MAIN = `
  <main>
    <slot for="layout.aside"/>

    <article>
      <slot for="layout.hero"/>
      <slot for="layout.article"/>
    </article>

    <slot for="layout.context"/>
  </main>
`

const PORTAL = `
  <div id="portal">
    <dialog id="menu">
      <a href="#" class="close">&times;</a>
      <navi :items="header.navi" label="main"/>
      <navi :items="header.toolbar" label="toolbar"/>
    </dialog>
  </div>
`

// system components
const html_tags = [
  { name: 'navi',  create: renderNav },
  { name: 'page-list', create: renderPageList },
  { name: 'markdown', create: ({ content }) => renderInline(content) },
  { name: 'pretty-date', create: (d) => renderPrettyDate(d.date || d.pubDate) },
]

const nuemark_tags = {
  'page-list': function(data) {
    const key = data.collection_name || data.content_collection
    return renderPageList(data[key])
  }
}


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
    article: nuemark(data.page, { data, lib, tags: nuemark_tags }).html,

    header: renderBlock('header', data.header && HEADER),
    footer: renderBlock('footer', data.footer && FOOTER),
    aside: renderBlock('aside'),

    hero: renderBlock('@hero'),
    context: renderBlock('@context'),

    portal: renderBlock('@portal', data.header && PORTAL),
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
    <slot for="layout.portal"/>
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

