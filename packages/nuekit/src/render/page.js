
import { renderScripts, renderHead } from './head'
import { renderNue, compileNue } from 'nuedom'
import { elem, renderInline as markdown } from 'nuemark'


export function renderSlots({ head=[], content='', comps=[], data={} }) {
  const attr = getAttr(data)
  const { scope } = data

  function slot(name) {
    if (data[name] === false) return ''
    const comp = comps.find(el => el.is ? el.is == name : el.tag == name)
    return comp ? renderNue(comp, { data, deps: comps }) : ''
  }

  const article = scope == 'article' ? content : `
    <article>
      ${ slot('pagehead') }
      ${ content }
      ${ slot('pagefoot') }
    </article>
  `

  const main = scope == 'main' ? content : `
    <main>
      ${ slot('aside') }
      ${ article }
      ${ slot('beside') }
    </main>
  `


  const body = scope == 'body' ? content : `
    <body${attr.class}>
      ${ slot('banner') }
      ${ slot('header') }
      ${ slot('subheader') }
      ${ main }
      ${ slot('footer') }
      ${ slot('bottom') }
    </body>
  `

  return trim(`
    <!doctype html>

    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ head.join('\n\t') }
        ${ slot('head') }
      </head>
      ${body}
    </html>
  `)
}


// used by renderMD and renderHTML
export async function renderPage({ asset, content, comps, data={} }) {
  const { is_dhtml, doctype } = await asset.parse()
  const assets = await asset.assets()
  const libs = await getLibPaths(assets)

  if (is_dhtml) libs.unshift(asset.path)
  if (doctype?.includes('standalone')) data.scope = 'body'

  const head = await renderHead(data, assets, libs)
  return renderSlots({ head, content, comps, data })
}


export async function renderMD(asset) {
  const { meta, headings, render } = await asset.parse()
  const comps = await asset.components()

  // data
  const data = await asset.data()
  const { sections, heading_ids } = data
  Object.assign(data, meta, { headings }, fileMeta(asset))

  const content = render({ data, sections, heading_ids, tags: convertToTags(comps, data) })

  return await renderPage({ content, comps, data, asset })
}

// <!html>
export async function renderHTML(asset) {
  const doc = await asset.parse()
  const { doctype, is_dhtml, lib, meta } = doc

  // library --> skip
  if (doctype?.includes('lib')) return is_dhtml ? compileNue(doc) : null

  // !dhtml -> renderDHTML
  if (doctype == 'dhtml') return await renderDHTML(asset)

  // data
  const data = await asset.data()
  Object.assign(data, meta, fileMeta(asset))

  // root
  const root = createWrapper(lib, data)
  data.scope = root.tag

  // content
  const comps = await asset.components()
  const content = renderNue(root, { data, deps: comps })

  // page
  return await renderPage({ content, comps, data, asset })
}

function createWrapper(lib, { sections }) {
  if (lib.length == 1) return lib[0]
  const wrap = { tag: sections ? 'section' : 'article', children: lib }

  // hoist child scripts into parent
  const script = []
  lib.forEach(el => {
    if (el.script) script.push(el.script)
    delete el.script
  })
  wrap.script = script.join('\n')

  return wrap
}


// <!dhtml>
export async function renderDHTML(asset) {
  const doc = await asset.parse()
  const comps = await asset.components('html')
  const data = await asset.data()
  const root = createWrapper(doc.lib, data)

  // force component name
  if (!root.is_custom && !root.is) root.is = 'default-app'

  // server-side html
  const content = root.is_custom ? elem('div', { nue: root.tag }) : elem(root.tag, { nue: root.is })
  data.scope = root.tag

  // "state" to importmap (if <body>)
  const map = data.import_map ??= {}
  map.state = '/@nue/state.js'
  const html = await renderPage({ asset, content, comps, data })

  return { html, js: compileNue({ ...doc, lib: [ root ]} ) }
}

/***** Helper functions *****/

function fileMeta(asset) {
  const { url, slug, dir } = asset
  return { url, slug, dir, markdown }
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

async function getLibPaths(assets) {
  const paths = []
  for (const asset of assets.filter(el => el.is_html)) {
    const { doctype } = await asset.parse()
    if (doctype?.includes('dhtml lib')) paths.push(asset.path)
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

export function trim(str) {
  return str.replace(/^\s*[\r\n]/gm, '').replace(/^ {4}/gm, '')
}





