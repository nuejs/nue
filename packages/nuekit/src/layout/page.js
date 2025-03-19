
import { parse as parseNue } from 'nuejs-core'

import { getLayoutComponents, renderPageList } from './components.js'
import { renderHead } from './head.js'


const SLOTS = 'head banner header subheader pagehead pagefoot aside beside footer bottom main'.split(' ')

const MAIN = parseNue(`
  <main>
    <slot for="aside"/>

    <article>
      <slot for="pagehead"/>
      <slot for="content"/>
      <slot for="pagefoot"/>
    </article>

    <slot for="beside"/>
  </main>
`)[0]

function getPageLayout(data) {
  const { language = 'en-US', direction = 'ltr' } = data
  const body_class = data.class ? ` class="${data.class}"` : ''

  const html = ltrim(`
    <html lang="${language}" dir="${direction}">

      <head>
        <slot for="system_head"/>
        <slot for="head"/>
      </head>

      <body${body_class}>
        <slot for="banner"/>
        <slot for="header"/>
        <slot for="subheader"/>
        <slot for="main"/>
        <slot for="footer"/>
        <slot for="bottom"/>
      </body>

    </html>
  `)

  return parseNue(html)[0]
}

export function getSPALayout(body, data) {
  const { language = 'en-US', direction = 'ltr' } = data

  return ltrim(`
    <html lang="${language}" dir="${direction}">
      <head>
        ${renderHead(data)}
      </head>

      <body>
        ${body}
      </body>
    </html>
  `)
}

// multiline left trim
function ltrim(str) {
  return str.trim().replace(/^ {4}/gm, '')
}


export function findComponent(name, lib) {
  return lib.find(comp => comp.name == name || !comp.name && comp.tagName == name)
}


export function renderSlots(data, lib) {
  const slots = {}

  for (const name of SLOTS) {
    const comp = findComponent(name, lib)
    if (comp && data[name] !== false) {
      try {
        let html = comp.render(data, lib)
        if (html && name == 'head') html = html.slice(6, -7)
        slots[name] = html

      } catch (e) {
        console.error(`Error rendering layout module: "${name}"`, e)
        throw { component: name, ...e }
      }
    }
  }
  return slots
}


// custom components as Markdown extensions (tags)
function convertToTags(components, data) {
  const tags = {}

  components.forEach(comp => {
    const { name } = comp || {}

    if (name && comp.render && !SLOTS.includes(name)) {
      tags[name] = function(data) {
        const { attr, innerHTML } = this
        return comp.render({ attr, ...data, innerHTML }, components)
      }
    }
  })

  return tags
}

export function renderPage(data, lib, custom_tags = {}) {
  const comps = [...lib, ...getLayoutComponents()]
  const { document } = data

  const tags = {
    ...convertToTags(comps, data),
    'page-list': renderPageList,
    toc: document.renderTOC,
    ...custom_tags
  }

  // nuemark opts: { data, sections, heading_ids, links, tags }
  const { heading_ids, sections, content_wrapper, links } = data
  const content = document.render({ data, heading_ids, sections, content_wrapper, links, tags })

  const slots = renderSlots({ ...data, content }, comps)

  // <main>...</main>
  if (!slots.main && data.main !== false) {
    slots.main = MAIN.render({ ...slots, ...data, content }, comps)
  }

  // <html>...</html>
  return getPageLayout(data).render({ system_head: renderHead(data), ...slots, ...data }, comps)
}

