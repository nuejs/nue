
import { nuedoc, elem } from 'nuemark'
import { parseNue } from 'nuejs-core'


// .svg, .html, .md
export async function renderDoc(file) {
  if (true) return '<h1>Hello</h1>'

  const content = await file.read()


  const document = file.is_md ? parseNue(content) : nuedoc(content)
  const { meta, tags } = document

  const fn = file.is_md ? renderPage :
    file.is_svg ? renderSVG :
    meta.spa ? renderSPA :
    renderHTML

  return fn({
    data: await file.data(),
    deps: await file.deps(),
    lib: await file.lib(),
    document,
    meta,
    tags
  })
}

export function renderPage({ document, meta, data, deps, lib }) {
  const alldata = { ...data, ...meta }
  const attr = getAttr(alldata)
  const html = []

  function slot(name) {
    const comp = lib.find(el => [el.is, el.tag].includes(name))
    return comp ? comp.render(alldata, lib) : ''
  }

  const main = `
    <main>
      ${ slot('aside') }

      <article>
        ${ slot('pagehead') }
        ${ document.render(alldata) }
        ${ slot('pagefoot') }
      </article>

      ${ slot('beside') }
    </main>
  `

  return trim(`
    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ renderHead(alldata, deps).join('\n\t\t') }
        ${ slot('head') }
      </head>

      <body${attr.class}>
        ${ slot('banner') }
        ${ slot('header') }
        ${ slot('subheader') }
        ${ main }
        ${ slot('footer') }
        ${ slot('bottom') }
      </body>
    </html>
  `)
}

export function renderSPA({ tags, data, deps, lib }) {
  const attr = getAttr(data)
  const head = tags.find(el => el.tag == 'head')
  const name = tags[0].is

  return trim(`
    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ renderHead(data, deps).join('\n\t\t') }
        ${ head ? head.render(data, lib) : '' }
      </head>

      <body custom="${ name }"></body>

    </html>
  `)
}


export function renderScripts(deps) {
  return deps.filter(file => ['.js', '.ts'].includes(file.ext))
    .map(file => elem('script', { src: `/${file.dir}/${file.name}.js`, type: 'module' }))
}

export function renderStyles(deps) {
  return deps.filter(file => file.ext == '.css')
    .map(file => elem('link', { rel: 'stylesheet', href: `/${file.path}` }))
}


function ogImage(data) {
  const og = data.og_image || data.og
  if (og) {
    const img = og[0] == '/' ? og : `/${data.dir}/${og}`
    return (data.origin || '') + img
  }
}

export function renderMeta(data, nue={}) {
  const desc = data.desc || data.description

  const meta = {
    charset:  'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    'article:published_time': data.date || data.pubDate,
    generator: `Nue v${data.version} (nuejs.org)`,
    'date.updated': new Date().toISOString(),
    'nue:components': nue.components,

    'og:title': data.title,
    'og:description': desc,
    'og:image': ogImage(data),

    description: desc,
    'theme-color': '',
    author: '',
    robots: '',
  }

  return Object.entries(meta).map(([key, val]) => {
    const content = val || data[key]
    return content && elem('meta', { name: key, content })

  }).filter(el => !!el)

}

export function renderHead(data, deps) {
  const { title } = data
  const head = []

  if (title) head.push(elem('title', data.title))

  head.push(...renderMeta(data))
  head.push(...renderStyles(deps))
  head.push(...renderScripts(deps))

  return head
}

function getAttr(data) {
  const { language = 'en-US', direction } = data
  return {
    class: data.class ? ` class="${data.class}"` : '',
    dir: direction ? ` dir="${direction}"` : '',
    language,
  }
}


function trim(str) {
  return str.replace(/^\s*[\r\n]/gm, '').replace(/^ {4}/gm, '')
}




