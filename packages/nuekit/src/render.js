
import { parseNue, renderNue, compileNue } from 'nuedom'
import { nuedoc, elem } from 'nuemark'
import { minifyCSS } from './css.js'

export async function renderMD(file) {
  const { meta, document } = nuedoc(await file.text())
  const data = { ...await file.data(), ...meta }
  const comps = await file.serverComponents()
  const assets = file.assets()
  const attr = getAttr(alldata)

  function slot(name) {
    const comp = comps.find(el => [el.is, el.tag].includes(name))
    return comp ? renderNue(comp, { data, deps: comps }) : ''
  }

  const main = `
    <main>
      ${ slot('aside') }

      <article>
        ${ slot('pagehead') }
        ${ document.render(data) }
        ${ slot('pagefoot') }
      </article>

      ${ slot('beside') }
    </main>
  `

  return trim(`
    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ renderHead(data, assets).join('\n\t\t') }
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


export async function renderSVG(file, minify) {
  const { standalone, elements } = parseNue(await file.text())
  const deps = await file.serverComponents()
  const assets = await file.assets()

  const ast = elements[0]
  const is_external = !standalone || ast.meta.interactive

  // scripts
  if (is_external) renderScripts(assets).forEach(script => ast.children.unshift(script))

  // style
  const css = is_external ? importCSS(assets) : await inlineCSS(assets, minify)
  ast.children.unshift({ tag: 'style', text: minify ? minifyCSS(css) : css })

  return renderNue(ast, { data: await file.data(), deps })
}

export async function renderHTML(file) {
  const document = parseNue(await file.text())
  const { doctype, elements } = document

  const main = elements[0]

  const opts = {
    data: await file.data(),
    deps: await file.serverComponents(),
    assets: await file.assets(),
  }

  if (doctype == 'dhtml') {
    const is_index = file.base == 'index.html'
    const js = compileNue(document)
    const html = is_index ? renderSPA(main, opts) : null
    return { js, html }
  }

  return { html: renderElement(main, opts) }
}

// interactive element (embedded with <object> tag)
export function renderElement(elem, { data, assets, deps }) {
  return trim(`
    <!doctype html>

    <head>${ renderHead(data, assets).join('\n') }</head>
    ${ renderNue(elem, { data, deps }) }
  `)
}

export function renderSPA(spa, { data, assets, deps }) {
  const head = deps.find(el => el.tag == 'head')
  const attr = getAttr(data)

  return trim(`
    <!doctype html>

    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ renderHead(data, assets).join('\n') }
        ${ head ? renderNue(head, { data, deps })  : '' }
      </head>

      <body :is="${ spa.is }"></body>

    </html>
  `)
}


export function renderScripts(assets) {
  return assets.filter(file => ['.js', '.ts'].includes(file.ext))
    .map(file => elem('script', { src: `/${file.dir}/${file.name}.js`, type: 'module' }))
}

export function renderStyles(assets) {
  return assets.filter(file => file.ext == '.css')
    .map(file => elem('link', { rel: 'stylesheet', href: `/${file.path}` }))
}

async function inlineCSS(assets, minify) {
  const css_files = assets.filter(el => el.is_css)
  const css = await Promise.all(css_files.map(file => file.text()))
  return css.join('\n')
}

function importCSS(assets) {
  return assets.filter(el => el.is_css).map(el => `@import url("${el.url}");`).join('\n')
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




