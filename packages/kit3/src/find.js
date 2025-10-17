
import { extname, join } from 'node:path'
import { createPage } from './page'
import { compileJS } from './asset'

export async function findAsset(url, sitename, assets) {
  const chain = await getChain(sitename, assets)

  const name = url.split('/').pop()
  const ext = extname(name)
  let path = url.slice(1)

  // toPage() helper
  async function toPage(asset) {
    return await createPage(asset, chain, assets)
  }

  // @nue asset
  if (path.startsWith('@nue')) return getNueAsset(name)

  // .html.js
  if (path.endsWith('.html.js')) path = path.slice(0, -3)

  // pretty URL's
  if (name && !ext) path += '.md'

  for (const site of chain) {

    // home page
    if (url == '/') {
      const home = assets.get(`${site}/home/index.md`)
      if (home) return await toPage(home)
    }

    // /, blog/, app/, docs/
    if (url.endsWith('/')) {
      const base = `${site}/${path}index`
      const asset = assets.get(`${base}.md`) || assets.get(`${base}.html`)
      if (asset) return await toPage(asset)

    } else {
      const asset = assets.get(`${site}/${path}`)
      if (asset) return asset.is_md ? await toPage(index) : asset
    }

    // error page
    if (!ext) {
      const asset = assets.get(`${site}/404.md`)
      if (asset) return await toPage(asset)
    }
  }

  if (url == '/favicon.ico') return Bun.file(getClientPath('favicon.ico'))

  // sitemap.xml

  // feed.xml

  // explicit not found
  return null
}


export async function getChain(sitename, assets) {
  const chain = [sitename]

  if (sitename == '@base') return chain

  while (true) {
    const asset = assets.get(`${sitename}/site.yaml`)
    if (!asset) break

    const data = await asset.parse()
    if (!data?.inherits) break

    chain.push(data.inherits)
    sitename = data.inherits
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
      const path = name == 'nue.js' ? resolve('nuestate/src/state.js')
        : name == 'state.js' ? resolve('nuestate/src/state.js')
        : getClientPath(name)

      return await compileJS(path, is_prod, name == 'nue.js')
    },
    contentType() {
      return 'application/javascript'
    },
  }
}


