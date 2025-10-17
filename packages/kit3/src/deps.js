
import { join, dirname, extname, sep } from 'node:path'

// shared directorier
const SHARED = ['data', 'design', 'ui'].map(dir => join('@shared', dir))

const TYPES = ['html', 'js', 'ts', 'yaml', 'css']

export async function getDeps(asset, chain, assets) {
  const { include, exclude } = await getIncludeOpts(asset, chain, assets)

  return assets.filter(dep => {

    // ignore self
    if (asset.path == dep.path) return false

    // skip non-deps
    if (!TYPES.includes(dep.type)) return false

    // not on inheritance chain
    if (!chain.includes(dep.site)) return false

    // root asset
    if (!dep.dir) return true

    // shared
    if (SHARED.some(dir => dep.path.startsWith(dir + sep))) return true

    // ui
    if (dep.dir?.endsWith(asset.dir + sep + 'ui')) return true

    // index.md -> home dir
    if (asset.path == 'index.md' && dep.dir == 'home') return true

  })

}

export async function getIncludeOpts(asset, chain, assets) {
  const opts = { include: [], exclude: [] }

  function push({ include, exclude }) {
    if (include) opts.include.push(...include)
    if (exclude) opts.exclude.push(...exclude)
  }

  for (const site of chain) {

    function find(path) {
      return assets.find(el => el.site == site && el.path == path)
    }

    const conf = find('site.yaml')
    if (conf) push(await conf.parse())

    if (asset.app) {
      const conf = find(join(asset.app, 'app.yaml'))
      if (conf) push(await conf.parse())
    }
  }

  // front matter
  if (asset.is_md) {
    const { meta } = await asset.parse()
    if (meta) push(meta)
  }

  return opts
}