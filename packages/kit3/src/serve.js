
import { createServer, hmr } from './tools/server'
import { fswatch } from './tools/fswatch'
import { createTree } from './tree'


export async function start({ port=5050 }) {
  const watcher = fswatch()

  const tree = createTree()
  await tree.load()

  watcher.onupdate = async path => {
    const asset = tree.update(path)

    if (asset.is_md || asset.is_css) {
      const { content } = await asset.render(hmr.host)
      asset.content = content
    }

    if (asset.is_html) {
      const doc = await asset.parse()
      asset.is_dhtml = doc.is_dhtml
      asset.is_lib = doc.is_lib
    }

    hmr.broadcast(asset)
  }

  watcher.onremove = path => {
    const asset = tree.get(path)

    if (asset) {
      tree.delete(path)
      hmr.broadcast({ remove: asset })
    }
  }

  // dev server
  const server = createServer({ port }, async url => {
    const asset = await tree.find(url)
    return asset?.render ? await asset.render() : asset
  })
}




