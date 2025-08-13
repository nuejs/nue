
import { extname, join } from 'node:path'

import { createServer, broadcast, sessions } from '../tools/server'
import { fswatch } from '../tools/fswatch'

import { getServer } from '../server'
import { getSystemFiles } from '../system.js'

const sysfiles = getSystemFiles()

export function findAssetByURL(url, assets=[]) {
  return [...sysfiles, ...assets].find(asset => {
    return url.endsWith('.html.js') ? asset.path == url.slice(1, -3)
      :  asset.url == url
  })
}

// server requests
export async function onServe(url, assets) {
  const asset = findAssetByURL(url, assets)
  const ext = extname(url)

  // return File || { content, type }
  if (asset) {
    const result = await asset.render()
    if (!result) return Bun.file(asset.rootpath)
    const content = (ext ? result.js : result.html) || result
    const type = ext ? await asset.contentType() : 'text/html; charset=utf-8'
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
  const opts = await assets.get('site.yaml')?.data()

  const { root, port=opts.port, ignore, silent } = args

  // user server
  const handler = await getServer(opts?.server)

  // dev server
  const server = createServer({ port, handler }, url => onServe(url, assets))

  const watcher = fswatch(root, { ignore })

  watcher.onupdate = async function(path) {
    const asset = await assets.update(path)

    if (asset) {
      asset.content = await asset.render() || await asset.text()

      if (asset.is_html) {
        asset.is_html_page = await asset.isPage()
        asset.is_dhtml = await asset.isDHTML()
        asset.is_spa = await asset.isSPA()
      }

      sessions.forEach(session => session.broadcast(asset))
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