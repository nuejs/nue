
import path, { extname, join } from 'node:path'

import { generateSitemap, generateFeed } from '../render/feed'
import { createServer, broadcast } from '../tools/server'
import { fswatch } from '../tools/fswatch'

import { getSystemFiles } from '../system'
import { getServer } from '../server'


export async function serve(site, { silent }) {
  const { conf, assets } = site
  const { root, ignore, port } = conf

  // user server
  const handler = await getServer(conf?.server)

  // dev server
  const server = createServer({ port, handler }, (url, params) =>
    onServe(url, assets, { params, conf })
  )

  const watcher = fswatch(root, { ignore })

  watcher.onupdate = async function(path) {
    const asset = await site.update(path)

    // site.yaml update
    if (asset.base == 'site.yaml') {
      const data = asset.content = await asset.parse()
      Object.assign(conf, data)
      return broadcast(asset)
    }

    if (asset) {
      asset.content = await asset.render({ hmr: true }) || await asset.text()
      if (asset.is_html) {
        asset.ast = await asset.parse()
        delete asset.ast.root
      }
      broadcast(asset)
    }
  }

  watcher.onremove = async function(path) {
    site.remove(path)
    broadcast({ remove: path })
  }

  const url = server.url.toString()
  if (!silent) console.log('Serving on', url)

  return { stop() { watcher.close(); server.stop() }, url, port, }

}


// server requests
export async function onServe(url, assets, opts={}) {
  const { params={}, conf={} } = opts

  // Redirect to trailing slash if it's a directory
  if (!url.endsWith('/') && !extname(url)) {
    const basePath = url.slice(1);
    const htmlPath = basePath ? `${basePath}/index.html` : 'index.html';
    const mdPath = basePath ? `${basePath}/index.md` : 'index.md';

    const indexAsset = assets.find(asset => asset.path === htmlPath || asset.path === mdPath);

    if (indexAsset) {
      return { redirect: url + '/' };
    }
  }

  const asset = findAssetByURL(url, assets)
  const ext = extname(url)

  // return File || { content, type }
  if (asset) {
    const result = await asset.render(params)
    if (!result) return Bun.file(asset.rootpath)
    const content = (ext ? result.js : result.html) || result
    const type = ext && params.hmr == null ? await asset.contentType() : 'text/html; charset=utf-8'
    return { content, type }
  }

  // SPA entry page
  if (!ext) {
    const app = url.split('/')[1]
    const spa = assets.find(asset => ['index.html', `${app}/index.html`].includes(asset.path))
    if (spa) return (await spa.render()).html
  }

  // sitemap.xml
  if (url == '/sitemap.xml' && conf.sitemap?.enabled) {
    const content = await generateSitemap(assets, conf)
    return content ? { content, type: 'application/xml; charset=utf-8' } : null
  }

  // feed.xml
  if (url == '/feed.xml' && conf.rss?.enabled) {
    const content = await generateFeed(assets, conf)
    return content ? { content, type: 'application/xml; charset=utf-8' } : null
  }

  // custom error page
  if (!ext) {
    const err = assets.find(asset => asset.name == '404')
    return err ? { content: await err.render(), status: 404 } : null
  }

  // favicon
  if (url == '/favicon.ico') return Bun.file(join(import.meta.dir, '../../favicon.ico'))

}


const sysfiles = getSystemFiles()

export function findAssetByURL(url, assets = []) {
  const targetPath = url.endsWith('.html.js') ? url.slice(1, -3) : url
  return [...sysfiles, ...assets].find(asset => {
    const assetPath = asset.path ? path.posix.normalize(asset.path) : undefined
    return assetPath === targetPath || asset.url === url
  })
}