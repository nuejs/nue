
import { parse } from 'node:path'
import { renderScripts, renderHead } from './head.js'
import { renderNue, compileNue } from 'nuedom'
import { minifyCSS } from './css.js'


export async function renderMD(asset, is_prod) {
  const doc = await asset.document()
  const data = { ...await asset.data(), ...doc.meta }
  const comps = await asset.components()
  const assets = await asset.assets()
  const libs = await getLibs(assets)
  const attr = getAttr(data)

  if (libs.length) assets.push(parse('@nue/mount.js'))
  if (!is_prod) assets.push(parse('@nue/hotreload.js'))

  function slot(name) {
    const comp = comps.find(el => [el.is, el.tag].includes(name))
    return comp ? renderNue(comp, { data, deps: comps }) : ''
  }

  const main = `
    <main>
      ${ slot('aside') }

      <article>
        ${ slot('pagehead') }
        ${ doc.render(data) }
        ${ slot('pagefoot') }
      </article>

      ${ slot('beside') }
    </main>
  `

  return trim(`
    <!doctype html>

    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ renderHead(data, assets, libs).join('\n\t\t') }
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


export async function renderSVG(asset, minify) {
  const { standalone, meta, elements } = await asset.document()
  const deps = await asset.components()
  const assets = await asset.assets()

  const ast = elements[0]
  const is_external = standalone === false || ast.meta?.interactive

  // scripts
  if (is_external) renderScripts(assets).forEach(script => ast.children.unshift(script))

  // style
  const css = is_external ? importCSS(assets) : await inlineCSS(assets, minify)
  ast.children.unshift({ tag: 'style', children: [{ text: minify ? minifyCSS(css) : css }] })

  return renderNue(ast, { data: await asset.data(), deps })
}

export async function renderHTML(asset) {
  const document = await asset.document()
  const { doctype, elements } = document
  const assets = await asset.assets()
  const main = elements[0]

  const opts = {
    data: await asset.data(),
    deps: await asset.components(),
    libs: await getLibs(assets),
    assets,
  }

  if (doctype == 'dhtml') {
    const is_index = asset.base == 'index.html'
    const js = compileNue(document)
    const html = is_index ? renderSPA(main, opts) : null
    return { js, html }
  }

  return { html: renderElement(main, opts) }
}

// interactive element (embedded with <object> tag)
export function renderElement(element, { data, assets, deps, libs }) {
  return trim(`
    <!doctype html>

    <head>
      ${ renderHead(data, assets, libs).join('\n\t') }
    </head>
    ${ renderNue(element, { data, deps }) }
  `)
}

export function renderSPA(spa, { data, assets, deps, libs }) {
  const customHead = deps.find(el => el.tag == 'head')
  const attr = getAttr(data)

  return trim(`
    <!doctype html>

    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ renderHead(data, assets, libs).join('\n') }
        ${ customHead ? renderNue(customHead, { data, deps })  : '' }
      </head>

      <body :is="${ spa.is }"></body>

    </html>
  `)
}


/***** Helper functions *****/

async function inlineCSS(assets, minify) {
  const css_files = assets.filter(el => el.is_css)
  const css = await Promise.all(css_files.map(file => file.text()))
  return css.join('\n')
}

function importCSS(assets) {
  return assets.filter(el => el.is_css).map(el => `@import url("/${el.path}");`).join('\n')
}

async function getLibs(assets) {
  const paths = []
  for (const asset of assets) {
    if (await asset.isDHTML()) paths.push(asset.url + '.js')
  }
  return paths
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




