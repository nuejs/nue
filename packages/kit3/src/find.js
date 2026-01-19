
import { extname, join, sep } from 'node:path'

export async function findAsset(url, chain, assets) {

  if (!chain?.[0]) chain = [ null, '@base' ]

  const parts = url.split('/')
  const name = parts.at(-1)
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
      const asset = find(`home${sep}index.md`)
      if (asset) return asset
    }

    // /, blog/, app/, docs/
    if (url.endsWith('/')) {
      const asset = find(`${path}index.md`)
      if (asset) return asset
    }

    // SPA entry
    if (!ext) {
      for (const app of parts.slice(0, -1)) {
        const asset = find(`${app}${app ? sep : ''}index.html`)
        if (asset) return asset
      }
    }

    // error page
    const asset = !ext && find('404.md')
    if (asset) return asset

  }

  if (url == '/favicon.ico') {
    return Bun.file(join(import.meta.dir, `..${sep}client${sep}favicon.ico`))
  }

  // explicit not found
  return null
}

// extname does not work when dot is in filename (/blog/v2.0-release)
function getExt(name) {
  const ext = extname(name)

  // ".woff2" length is 6
  return ext?.length <= 6 && !ext?.includes('-') ? ext : null
}
