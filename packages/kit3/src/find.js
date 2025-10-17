
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileJS } from './asset'

export async function findAsset(url, chain, assets) {
  const name = url.split('/').pop()
  const ext = extname(name)
  let path = url.slice(1)

  // @nue asset
  if (path.startsWith('@nue')) return getNueAsset(name)

  // .html.js
  if (path.endsWith('.html.js')) path = path.slice(0, -3)

  // pretty URL's
  if (name && !ext) path += '.md'

  for (const site of chain) {

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

  if (url == '/favicon.ico') return Bun.file(getClientPath('favicon.ico'))

  // sitemap.xml

  // feed.xml

  // explicit not found
  return null
}


export async function getChain(site, assets) {
  const chain = [site]

  if (site == '@base') return chain

  while (true) {
    const asset = assets.find(el => el.site == site && el.path == 'site.yaml')
    if (!asset) break

    const data = await asset.parse()
    if (!data?.inherits) break

    chain.push(data.inherits)
    site = data.inherits
  }

  return [...chain, '@base']
}


function resolve(pkg) {
  return fileURLToPath(import.meta.resolve(pkg))
}

function getClientPath(name) {
  return join(import.meta.dir, '../client', name)
}

export function getNueAsset(name, is_prod) {
  return {
    async render(is_prod) {
      const path = name == 'nue.js' ? resolve('nuedom/src/nue.js')
        : name == 'state.js' ? resolve('nuestate/src/state.js')
        : getClientPath(name)

      return await compileJS(path, is_prod, name == 'nue.js')
    },
    contentType() {
      return 'application/javascript'
    },
  }
}


