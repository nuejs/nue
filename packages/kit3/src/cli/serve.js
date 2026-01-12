
import { createServer, hmr } from '../tools/server'
import { fswatch } from '../tools/fswatch'
import { createProxy } from '../proxy'

export async function start(tree, { port=4000, version, silent }) {
  const watcher = fswatch()

  watcher.onupdate = async path => {
    const asset = tree.update(path)
    asset.hosts = hmr.hosts

    for (const browser of hmr.browsers) {
      const update = await getUpdate(browser.url, asset, tree)
      browser.broadcast(update)
    }
  }

  watcher.onremove = path => {
    const asset = tree.get(path)

    if (asset) {
      tree.delete(path)
      hmr.broadcast({ remove: asset })
    }
  }

  // proxy server
  const conf = await tree.getConf()
  const handler = conf.proxy ? createProxy(conf.proxy) : null

  // multi-site server
  const server = createServer({ port, handler }, async url => {
    return await tree.renderURL(url)
  })

}

// HMR update
async function getUpdate(url, asset, tree) {

  // html extra props
  if (asset.is_html) {
    const { is_dhtml } = await asset.parse()
    asset.is_server_html = !is_dhtml
    asset.is_dhtml = is_dhtml
  }

  // page update
  if (asset.is_md || asset.is_yaml || asset.is_server_html) {
    const { content } = await tree.renderURL(url)
    return { ...asset, content }
  }

  // CSS text
  if (asset.is_css) asset.css = await asset.text()

  return asset

}

