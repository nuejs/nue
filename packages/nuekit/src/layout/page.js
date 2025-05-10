
import { parseHyper, renderHyper, renderToString } from 'nue-hyper'

import { getServerFunctions } from './components.js'
import { renderHead } from './head.js'


const SLOTS = 'head banner header subheader pagehead pagefoot aside beside footer bottom main'.split(' ')

const MAIN = parseHyper(`
  <main>
    #{ aside }

    <article>
      #{ pagehead }
      #{ content }
      #{ pagefoot }
    </article>

    #{ beside }
  </main>
`)[0]

function getPageLayout(data) {
  const { language = 'en-US', direction } = data
  const body_class = data.class ? ` class="${data.class}"` : ''
  const dir = direction ? ` dir="${direction}"` : ''

  const html = ltrim(`
    <html lang="${language}"${dir}>
      <head>
        #{ system_head }
        #{ head }
      </head>

      <body${body_class}>
        #{ banner}
        #{ header }
        #{ subheader }
        #{ main }
        #{ footer }
        #{ bottom }
      </body>
    </html>
  `)

  return parseHyper(html)[0]
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
  return lib.find(comp => comp.is == name || !comp.is && comp.tag == name)
}


export function renderSlots(data, opts) {
  const slots = {}

  for (const name of SLOTS) {
    const comp = findComponent(name, opts.lib)
    if (comp && data[name] !== false) {
      try {
        let html = renderToString(comp, data, opts)
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
function convertToFns(lib, data) {
  const fns = { ...getServerFunctions() }

  lib.forEach(ast => {
    const name = ast.is || ast.tag

    if (ast.is_custom && !SLOTS.includes(name)) {
      delete ast.is_custom
      ast.tag = 'div'

      fns[name] = function(data) {
        return renderToString(ast, data, { fns, slot: this.innerHTML, lib })
      }
    }
  })

  return fns
}

export function renderPage(data, lib, custom_tags = {}) {
  const { document } = data

  const fns = {
    toc: document.renderTOC,
    ...convertToFns(lib, data),
    ...getServerFunctions(),
    ...custom_tags,
  }

  // nuemark opts: { data, sections, heading_ids, links, fns }
  const { heading_ids, sections, content_wrapper, links } = data

  const content = document.render({
    data, heading_ids, sections, content_wrapper, links, tags: fns
  })

  const slots = renderSlots({ ...data, content }, { lib, fns })

  // <main>...</main>
  if (!slots.main && data.main !== false) {
    slots.main = renderToString(MAIN, { ...slots, ...data, content }, { lib })
  }
  // <html>...</html>
  const ast = getPageLayout(data)
  return renderToString(ast, { system_head: renderHead(data), ...slots, ...data }, { lib })
}

