
import { parse } from 'node:path'
import { renderScripts, renderHead, inlineCSS } from './head'
import { renderNue, compileNue } from 'nuedom'
import { renderInline as markdown } from 'nuemark'
import { minifyCSS } from './tools/css'


export async function renderPage(asset, is_prod) {
  const doc = await asset.document()
  const { url, slug, dir } = asset

  const data = {
    ...await asset.data(), ...doc.meta, url, dir, slug,
    is_prod, markdown, headings: doc.headings,
  }
  const comps = await asset.components()
  const assets = await asset.assets()
  const libs = await getLibs(assets)

  if (libs.length) assets.push(parse('@nue/mount.js'))
  if (!is_prod) assets.push(parse('@nue/hmr.js'))

  function slot(name) {
    const comp = comps.find(el => el.is ? el.is == name : el.tag == name)
    return comp ? renderNue(comp, { data, deps: comps }) : ''
  }


  // .md || index.html
  const content = asset.is_html ? renderNue(doc.elements[0], { data, deps: comps })
    : doc.render({ data, sections: data.sections, tags: convertToTags(comps, data) })

  const main = `
    <main>
      ${ slot('aside') }

      <article>
        ${ slot('pagehead') }
        ${ content }
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
  const custom = spa.is_custom || spa.is ? `nue="${spa.is || spa.tag}"` : 'nue'

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

      <body ${ custom }></body>

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
    if (await asset.isDHTML()) paths.push(asset.path)
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

// custom components as Markdown extensions (tags)
function convertToTags(deps, data) {
  const tags = {}

  deps.forEach(ast => {
    if (!ast.is_custom && !ast.is) return
    const name = ast.is || ast.tag

    // if (ast.is_custom) { delete ast.is_custom; ast.tag = 'div' }

    tags[name] = function(args) {
      return renderNue(ast, {
        data: { ...data, ...args },
        slot: this.innerHTML,
        deps
      })
    }
  })

  return tags
}


