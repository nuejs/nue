
import { extname, join } from 'node:path'

export async function findAsset(url, chain, assets) {
  if (!chain?.[0]) chain = [ null, '@base' ]

  const name = url.split('/').pop()
  const ext = getExt(name)
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

  // explicit not found
  return null
}

// extname does not work when dot is in filename (.woff2 length = 6)
function getExt(name) {
  const ext = extname(name)
  return ext?.length <= 6 && !ext?.includes('-') ? ext : null
}
