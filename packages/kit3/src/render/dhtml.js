
import { elem } from 'nuemark'


// <!html>
export async function renderHTML(asset) {
  const ast = await asset.parse()
  const { is_dhtml } = ast

  // raw HTML
  const is_raw = ast.doctype == 'html' && ['html', 'head'].includes(ast.root.tag)
  if (is_raw) return await asset.text()

  // library --> skip
  if (ast.is_lib) return is_dhtml ? compileNue(ast) : null

  // !dhtml -> renderDHTML
  if (is_dhtml) return await renderDHTML(asset)

  // data
  const data = await asset.data()
  Object.assign(data, ast.meta, fileMeta(asset))

  // root
  const conf = await asset.config()
  const root = createWrapper(ast.lib, conf.content?.sections)
  data.scope = root.tag

  // content
  const comps = await asset.components()

  const { max_class_names } = conf.design || {}
  const content = renderNue(root, { data, deps: comps, globals, max_class_names })

  // page
  return await renderPage(asset, { content, comps, data, conf })
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


// <!dhtml>
export async function renderDHTML(asset) {
  const doc = await asset.parse()
  const comps = await asset.components(true)
  const data = await asset.data()
  const conf = await asset.config()
  const root = createWrapper(doc.lib, conf.content?.sections)

  // force component name
  if (!root.is_custom && !root.is) root.is = 'default-app'

  // server-side html
  const content = root.is_custom ? elem('div', { nue: root.tag }) : elem(root.tag, { nue: root.is })
  data.scope = root.tag

  // "state" to importmap (if <body>)
  const map = conf.import_map ??= {}
  map.state = '/@nue/state.js'
  const html = await renderPage({ asset, content, comps, data, conf })

  return { html, js: compileNue({ ...doc, lib: [ root ]} ) }
}

/***** Helper functions *****/

function fileMeta(asset) {
  const { url, slug, dir } = asset
  return { url, slug, dir }
}



