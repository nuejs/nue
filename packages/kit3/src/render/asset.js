
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateSitemap, generateFeed } from './feed'
import { minifyCSS } from '../tools/css'
import { renderPage } from './page'
import { renderHTML } from './html'


export async function renderAsset(asset, chain, assets, is_prod) {
  return asset.is_md ? await renderPage(asset, chain, assets, is_prod)
    : asset.is_html ? await renderHTML(asset, chain, assets, is_prod)
    : asset.is_js && is_prod || asset.is_ts ? await compileJS(asset.filepath, is_prod)
    : asset.is_css && is_prod ? minifyCSS(await asset.text())
    : asset.is_nue ? await readNueAsset(asset.name, is_prod)
    : await asset.text()
}

export async function renderFeed(url, site, conf, assets) {
  const pages = assets.filter(el => el.is_md && el.site == site)

  // sitemap.xml
  if (url == '/sitemap.xml' && conf.sitemap?.enabled) {
    return await generateSitemap(pages, conf)

  } else if (url == '/feed.xml' && conf.rss?.enabled) {
    return await generateFeed(pages, conf)
  }
}

export async function compileJS(path, minify, bundle) {
  const result = await Bun.build({
    external: bundle ? undefined : ['*'],
    entrypoints: [path],
    target: 'browser',
    minify
  })

  const [ js ] = result.outputs
  return await js.text()
}

function resolvePackage(path) {
  return fileURLToPath(import.meta.resolve(path))
}

async function readNueAsset(name, is_prod) {
  const path = name == 'nue.js' ? resolvePackage('nuedom/src/nue.js')
    : name == 'state.js' ? resolvePackage('nuestate/src/state.js')
    : join(import.meta.dir, '../../client', name)

  return await compileJS(path, is_prod, name == 'nue.js')
}




