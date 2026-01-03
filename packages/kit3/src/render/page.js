
// .md page rendering
import { sep } from 'node:path'

import { renderNue } from 'nuedom'

import { getDeps, getComponents } from '../deps'
import { renderContent, globals } from './slot'
import { getCollections } from '../collections'
import { getData, getConf } from '../data'
import { renderHead } from './head'



export async function renderPage(asset, chain, assets, is_prod) {
  const deps = await getDeps(asset, chain, assets)
  const document = await asset.parse()
  const { meta, headings } = document

  // conf, data, and components
  const conf = await getConf(asset.app, chain, assets, is_prod)
  const data = await getData(deps, is_prod)
  const comps = await getComponents(deps)

  Object.assign(data, data.meta, meta, { dir: asset.dir, slug: asset.slug, url: asset.url })

  // content collections
  Object.assign(data, await getCollections(assets, conf.collections, chain))

  // content conf
  const c_conf = conf.content || {}

  const content = document.render({
    content_wrapper: meta?.content_wrapper || c_conf.content_wrapper,
    heading_ids: meta?.heading_ids || c_conf.heading_ids,
    sections: meta?.sections || c_conf.sections,
    tags: convertToTags(comps, data),
    links: conf.links,
    data,
  })

  const head = await renderHead({ conf, data, deps })

  return renderContent(content, { head, comps, data, conf })
}


// custom components as Markdown extensions (tags)
function convertToTags(deps, data) {
  const tags = {}

  deps.forEach(ast => {
    if (!ast.is_custom && !ast.is) return
    const name = ast.is || ast.tag

    // if (ast.is_custom) { delete ast.is_custom; ast.tag = 'div' }

    tags[name] = function(args) {
      const { attr, blocks } = this
      return renderNue(ast, {
        data: { ...args, ...attr, attr, blocks },
        slot: this.innerHTML,
        globals,
        deps
      })
    }
  })

  return tags
}

