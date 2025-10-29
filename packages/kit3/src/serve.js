
import { createServer, hmr } from './tools/server'
import { createEdgeServer } from './edge/server'
import { fswatch } from './tools/fswatch'
import { createProxy } from './proxy'
import { createTree } from './tree'


export async function start({ port=5050 }) {
  const watcher = fswatch()

  const tree = createTree()
  await tree.load()

  watcher.onupdate = async path => {
    const asset = tree.update(path)

    if (asset.is_html) {
      const ast = await asset.parse()
      asset.is_dhtml = ast.is_dhtml
      asset.is_lib = ast.is_lib
    }

    // TODO: tree.resolve(path, url)
    for (const browser of hrm.sessions) {
      asset.content = tree.render(browser.url)
      browser.broadcast(asset)
    }
  }

  watcher.onremove = path => {
    const asset = tree.get(path)

    if (asset) {
      tree.delete(path)
      hmr.broadcast({ remove: asset })
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




