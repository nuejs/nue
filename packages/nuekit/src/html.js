
import { parse } from 'node:path'
import { renderScripts, renderHead, inlineCSS } from './head'
import { renderNue, compileNue } from 'nuedom'
import { minifyCSS } from './tools/css'


export async function renderMD(asset, is_prod) {
  const doc = await asset.document()
  const data = { ...await asset.data(), ...doc.meta, is_prod }
  const comps = await asset.components()
  const assets = await asset.assets()
  const libs = await getLibs(assets)

  if (libs.length) assets.push(parse('@nue/mount.js'))
  if (!is_prod) assets.push(parse('@nue/hmr.js'))

  function slot(name) {
    const comp = comps.find(el => [el.is, el.tag].includes(name))
    if (comp?.is_custom) { delete comp.is_custom; comp.tag = 'div' }
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

  const attr = getAttr(data)

  return trim(`
    <!doctype html>

    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ (await renderHead(data, assets, libs)).join('\n\t') }
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
  const data = await asset.data()
  const deps = await asset.components()
  const assets = await asset.assets()

  const ast = elements[0]
  const is_external = standalone === false || ast.meta?.interactive

  // scripts
  if (is_external) renderScripts(assets).forEach(script => ast.children.unshift(script))

  // style
  const css = is_external ? importCSS(assets) : await inlineCSS(assets, minify)

  if (css) {
    if (!ast.children) ast.children = []
    ast.children.unshift({ tag: 'style', children: [{ text: minify ? minifyCSS(css) : css }] })
  }
  return renderNue(ast, { data, deps })
}

export async function renderHTML(asset, is_prod) {
  const document = await asset.document()
  const { doctype, elements } = document
  const assets = await asset.assets()
  const main = elements[0]

  const opts = {
    data: { ...await asset.data(), is_prod },
    deps: await asset.components(),
    libs: await getLibs(assets),
    assets,
  }

  if (doctype == 'dhtml') {
    const is_spa = await asset.isSPA()
    const js = compileNue(document)
    const html = is_spa ? await renderSPA(main, opts) : null
    return { is_spa, js, html }
  }

  return renderElement(main, opts)
}

// interactive element (embedded with <object> tag)
export async function renderElement(element, { data, assets, deps, libs }) {

  return trim(`
    <!doctype html>

    <head>
      ${ (await renderHead(data, assets, libs)).join('\n\t') }
    </head>

    ${ renderNue(element, { data, deps }) }
  `)
}

export async function renderSPA(spa, { data, assets, deps, libs }) {
  const customHead = deps.find(el => el.tag == 'head')
  const attr = getAttr(data)

  // mounting & HMR
  if (libs.length) assets.push(parse('@nue/mount.js'))
  if (!data.is_prod) assets.push(parse('@nue/hmr.js'))

  return trim(`
    <!doctype html>

    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ (await renderHead(data, assets, libs)).join('\n') }
        ${ customHead ? renderNue(customHead, { data, deps })  : '' }
      </head>

      <body custom="${ spa?.is || spa.tag }"></body>

    </html>
  `)
}


/***** Helper functions *****/

function importCSS(assets) {
  return assets.filter(el => el.is_css).map(el => `@import url("/${el.path}");`).join('\n')
}

async function getLibs(assets) {
  const paths = []
  for (const asset of assets) {
    if (await asset.isDHTML()) paths.push(`/${asset.dir}/${asset.name}.html.js`.replace('//', '/'))
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




