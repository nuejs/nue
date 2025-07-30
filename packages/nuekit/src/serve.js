
import { extname, join } from 'node:path'
import { getSystemFiles } from './system.js'
import { createServer } from './server'
import { fswatch } from './fswatch'


const sysfiles = getSystemFiles()

export function findAssetByURL(url, assets=[]) {
  return [...sysfiles, ...assets].find(asset =>
    asset.url == (url.endsWith('.html.js') ? url.slice(0, -3) : url)
  )
}

// server requests
export async function onServe(url, assets) {
  const asset = findAssetByURL(url, assets)

  // render or serve file directly
  if (asset) {
    const result = await asset.render()
    return !result ? Bun.file(asset.rootpath) :
      { content: result?.html || result, type: await asset.contentType() }
  }

  // custom error page
  if (!extname(url)) {
    const err = assets.find(asset => asset.base == '404')
    return err ? { html: await err.render(), status: 404 } : null
  }

  // favicon
  if (url == '/favicon.ico') return Bun.file(join(import.meta.dir, '../favicon.ico'))

}


// OPTS: { root, port, worker, ignore }
export function serve(assets, opts) {
  const { root, port, ignore, silent } = opts

  const server = createServer(opts, url => onServe(url, assets))

  const watcher = fswatch(root, { ignore })

  watcher.onupdate = async function(path) {
    const asset = await assets.update(path)

    if (asset) {
      const content = await renderFile(asset)
      server.broadcast({ ...asset, content })
    }
  }

  watcher.onremove = async function(path) {
    assets.remove(path)
    server.broadcast({ remove: path })
  }

  const url = server.url.toString()
  if (!silent) console.log('Serving on', url)

  return { stop() { watcher.close(); server.stop() }, url, port, }

}