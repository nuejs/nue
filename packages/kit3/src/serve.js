
import { createServer, hmr } from './tools/server'
import { createEdgeServer } from './edge/server'
import { fswatch } from './tools/fswatch'
import { createProxy } from './proxy'
import { createLog } from './cli/dev'
import { createTree } from './tree'


export async function start({ port=5050, version }) {

  const log = createLog({ version, port })
  const watcher = fswatch()
  const tree = createTree()
  await tree.load()

  watcher.onupdate = async path => {
    const asset = tree.update(path)
    log.trackUpdate(asset)

    for (const browser of hmr.browsers) {
      const diff = await patch(browser.url, asset, tree)
      if (diff) {
        browser.broadcast(diff)
        log.trackHMR(browser.url.host)
      }
    }

    log.render()
  }

  watcher.onremove = path => {
    const asset = tree.get(path)

    if (asset) {
      tree.delete(path)
      hmr.broadcast({ remove: asset })
      log.trackRemove(asset)
    }
  }

  // handler (custm proxy or edge server mock)
  const conf = await tree.getConf()
  const handler = conf.proxy ? createProxy(conf.proxy) : createEdgeServer(tree, conf)

  // dev server
  const server = createServer({ port, handler }, async url => {
    return await tree.render(url)
  })

}

// HMR update
async function patch(url, asset, tree) {

  // redirect
  if (asset.is_md && url.pathname != asset.url) return { ...asset, redirect: true }

  // dhtml component
  if (asset.is_html) {
    const { is_dhtml } = await asset.parse()
    return { ...asset, is_dhtml: true }
  }

  asset.is_ext = asset.is_css || asset.is_js || asset.is_ts

  // external dependency
  if (asset.is_ext && await tree.dependsOn(url, asset.path)) {
    if (asset.is_css) asset.css = await asset.text()
    return asset

  // page update
  } else if (asset.is_md || asset.is_yaml || asset.is_html) {
    const ret = await tree.render(url)
    if (ret) return { ...asset, content: ret.content }
  }

}

