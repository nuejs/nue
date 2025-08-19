
import { extname, join } from 'node:path'

import { createServer, broadcast } from '../tools/server'
import { fswatch } from '../tools/fswatch'

import { getSystemFiles } from '../system'
import { readSiteYAML } from '../site'
import { getServer } from '../server'

const sysfiles = getSystemFiles()

export function findAssetByURL(url, assets=[]) {
  return [...sysfiles, ...assets].find(asset => {
    return url.endsWith('.html.js') ? asset.path == url.slice(1, -3)
      :  asset.url == url
  })
}

// server requests
export async function onServe(url, assets, params) {
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

  // custom error page
  if (!ext) {
    const err = assets.find(asset => asset.base == '404')
    return err ? { html: await err.render(), status: 404 } : null
  }

  // favicon
  if (url == '/favicon.ico') return Bun.file(join(import.meta.dir, '../../favicon.ico'))

}

export async function serve(assets, args) {
  const { root, ignore, silent } = args
  const opts = await readSiteYAML(root)

  // user server
  const handler = await getServer(opts?.server)

  // dev server
  const port = args.port || opts.port
  const server = createServer({ port, handler }, (url, params) => onServe(url, assets, params))

  const watcher = fswatch(root, { ignore })

  watcher.onupdate = async function(path) {
    const asset = await assets.update(path)

    if (asset) {
      asset.content = await asset.render({ hmr: true }) || await asset.text()
      asset.doctype = asset.is_html && (await asset.parse()).doctype
      broadcast(asset)
    }
  }

  watcher.onremove = async function(path) {
    assets.remove(path)
    broadcast({ remove: path })
  }

  const url = server.url.toString()
  if (!silent) console.log('Serving on', url)

  return { stop() { watcher.close(); server.stop() }, url, port, }

}