
import { extname, join } from 'node:path'

export async function findAsset(url, chain, assets) {
  const name = url.split('/').pop()
  const ext = extname(name)
  let path = url.slice(1)

  // @nue asset
  if (path.startsWith('@nue')) return { is_nue: true, name, type: 'js' }

  // .html.js
  if (path.endsWith('.html.js')) path = path.slice(0, -3)

  // pretty URL's
  if (name && !ext) path += '.md'

  for (const site of chain.toReversed()) {

    function find(path) {
      return assets.find(el => el.site == site && el.path == path)
    }

    // asset
    if (path) {
      const asset = find(path)
      if (asset) return asset

    // home page
    } else if (url == '/') {
      const asset = find('home/index.md')
      if (asset) return asset
    }

    // /, blog/, app/, docs/
    if (url.endsWith('/')) {
      const asset = find(`${path}index.md`) || find(`${path}index.html`)
      if (asset) return asset
    }

    // error page
    const asset = !ext && find('404.md')
    if (asset) return asset

  }

  if (url == '/favicon.ico') {
    return Bun.file(join(import.meta.dir, '../client/favicon.ico'))
  }

  // sitemap.xml

  // feed.xml

  // explicit not found
  return null
}
