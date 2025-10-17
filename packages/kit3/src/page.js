
import { sep } from 'node:path'

import { renderNue } from 'nuedom'

import { renderContent } from './render/slot'
import { renderHead } from './render/head'
import { getConf, getData } from './conf'
import { getDeps } from './deps'


export async function createPage(asset, chain, assets) {

  const deps = await getDeps(asset, chain, assets)

  // .md only
  async function render(is_prod) {
    const document = await asset.parse()
    const { meta, headings } = document

    // conf, data, and components
    const conf = await getConf(asset.app, chain, assets, is_prod)
    const data = await getData(deps, is_prod)
    const comps = await getComponents(deps)

    // content conf
    Object.assign(data, { dir: asset.dir, slug: asset.slug, url: asset.url })

    const content = document.render({
      heading_ids: meta?.heading_ids || conf.content?.heading_ids,
      sections: meta?.sections || conf.content?.sections,
      tags: convertToTags(comps, data),
      links: conf.links,
      data,
    })

    const head = await renderHead({ conf, data, deps })

    return renderContent(content, { head, comps, data, conf })
  }

  return { ...asset, render }
}


export async function getComponents(deps, dynamic) {
  const ret = []

  for (const asset of deps.filter(el => el.is_html)) {
    const ast = await asset.parse()

    if (ast.is_lib) {
      const same_type = !dynamic == !ast.is_dhtml
      const isomorphic = ast.doctype?.startsWith('html+dhtml')
      if (isomorphic || same_type) ret.push(...ast.lib)
    }
  }

  return ret
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

