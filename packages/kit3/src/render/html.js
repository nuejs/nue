
import { compileNue, renderNue } from 'nuedom'
import { elem } from 'nuemark'

import { getDeps, getComponents } from '../deps'
import { renderContent, globals } from './slot'
import { getCollections } from '../collections'
import { getData, getConf } from '../data'
import { renderHead } from './head'


export async function renderHTML(asset, chain, assets, is_prod) {
  const ast = await asset.parse()
  const { is_dhtml } = ast

  // raw HTML
  const is_raw = ast.doctype == 'html' && ['html', 'head'].includes(ast.root.tag)
  if (is_raw) return await asset.text()

  // library --> compile
  if (ast.is_lib) return is_dhtml ? compileNue(ast) : null

  // render page
  const fn = is_dhtml ? renderSPA : renderHTMLPage
  return await fn(asset, chain, assets, is_prod)
}


// <!html> page
export async function renderHTMLPage(asset, chain, assets, is_prod) {
  const ast = await asset.parse()
  const deps = await getDeps(asset, chain, assets)
  const conf = await getConf(asset.app, chain, assets, is_prod)
  const data = await getData(deps, is_prod)
  const comps = await getComponents(deps)

  // file meta
  Object.assign(data, { dir: asset.dir, slug: asset.slug, url: asset.url })

  // content collections
  Object.assign(data, await getCollections(assets, conf.collections))

  // root
  const root = createWrapper(ast.lib, conf.content?.sections)
  data.scope = root.tag

  // html
  const { max_class_names } = conf.design || {}
  const html = renderNue(root, { data, deps: comps, globals, max_class_names })

  // page
  const head = await renderHead({ conf, data, deps })

  return renderContent(html, { head, comps, data, conf })
}


// SPA: <!dhtml> && <body>
export async function renderSPA(asset, chain, assets, is_prod) {
  const conf = await getConf(asset.app, chain, assets, is_prod)
  const deps = await getDeps(asset, chain, assets)
  const data = await getData(deps, is_prod)
  const comps = await getComponents(deps, true)
  const doc = await asset.parse()
  const { root } = doc
  root.is ??= 'default-app'

  // state.js
  const map = conf.import_map ??= {}
  map.state = '/@nue/state.js'
  data.scope = 'body'

  deps.push(asset)

  // html page
  const head = await renderHead({ conf, data, deps })
  const body = elem('body', { nue: root.is })
  const html = renderContent(body, { head, comps, data, conf })

  return { html, js: compileNue(doc) }
}


function createWrapper(lib, use_sections) {
  if (lib.length == 1) return lib[0]
  const wrap = { tag: use_sections ? 'section' : 'article', children: lib }

  // hoist child scripts into parent
  const script = []
  lib.forEach(el => {
    if (el.script) script.push(el.script)
    delete el.script
  })
  wrap.script = script.join('\n')

  return wrap
}






