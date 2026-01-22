
import { styleText } from 'node:util'
import { createServer, hmr } from '../tools/server'
import { printSummaryTable, log } from './build'
import { fswatch } from '../tools/fswatch'
import { createProxy } from '../proxy'
import { parseHost } from '../tree'

export async function start(tree, { port=4000, version, silent }) {
  const watcher = fswatch()
  const all = tree.getAll()

  printSummaryTable(all)
  printWatching(all, port)

  watcher.onupdate = async path => {
    const asset = tree.update(path)
    if (!asset) return

    log(asset)

    for (const browser of hmr.browsers) {
      const update = await getUpdate(browser.url, asset, tree)
      if (update) browser.broadcast(update)
    }
  }

  watcher.onremove = path => {
    const asset = tree.remove(path)

    if (asset) {
      hmr.broadcast({ ...asset, is_remove: true })
      log(asset, 'red')
    }
  }

  // proxy server
  const conf = await tree.getConf()
  const handler = conf.server ? createProxy(conf.server) : null

  // multi-site server
  const server = createServer({ port, handler }, async url => {
    return await tree.renderURL(url)
  })
}

// HMR update
async function getUpdate(url, asset, tree) {

  // not in chain -> skip
  const chain = await tree.getChain(parseHost(url.host))
  if (!chain.includes(asset.site)) return


  // html extra props
  if (asset.is_html) {
    const { is_dhtml } = await asset.parse()
    asset.is_server_html = !is_dhtml
    asset.is_dhtml = is_dhtml
  }

  // page update
  if (asset.is_md || asset.is_yaml || asset.is_server_html) {
    const ret = await tree.renderURL(url)
    return { ...asset, ...ret }
  }

  // CSS text
  if (asset.is_css) asset.css = await asset.text()

  return asset
}

function printWatching(all, port) {
  const msg = `Watching ${ all.length } files @ http://<sitename>.localhost:${port}`
  console.log(`\n   ${ styleText('magenta', msg) } \n`)
}

