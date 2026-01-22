
import { readdir } from 'node:fs/promises'
import { join, sep } from 'node:path'

const CONF = [
  'extend', 'site', 'is_prod', 'design', 'server', 'collections', 'production',
  'sitemap', 'rss', 'include', 'exclude', 'meta', 'content', 'import_map', 'svg',
  'processor'
]


export async function getConf(app, chain, assets, is_prod) {
  const conf = { is_prod }

  for (const site of chain) {
    const file = assets.find(el => el.site == site && el.path == 'site.yaml')
    if (file) Object.assign(conf, await file.parse())
  }

  for (const site of chain) {
    const file = assets.find(el => el.site == site && el.app == app && el.base == 'app.yaml')
    if (file) Object.assign(conf, await file.parse())
  }

  Object.keys(conf).forEach(key => {
    if (!CONF.includes(key)) delete conf[key]
  })

  return conf
}


export async function getData(deps, is_prod) {
  const data = { is_prod }

  // @base first
  for (const dep of deps.toReversed().filter(el => el.is_yaml || el.is_json)) {
    const yaml = await dep.parse()

    if (is_prod) Object.assign(yaml.meta ??= {}, yaml.production)

    Object.entries(yaml).forEach(([key, val]) => {
      if (key == 'meta') return Object.assign(data, val)
      else if (!CONF.includes(key)) data[key] = val
    })
  }

  await runDataScripts(data, deps, is_prod)

  return data
}


// modifier scripts
export async function runDataScripts(data, deps, is_prod) {

  const mods = deps.filter(f =>
    (f.is_js || f.is_ts) &&
    !f.name?.endsWith('.test') &&
    f.dir?.startsWith(`@shared${sep}data`)
  )

  for (const mod of mods) {
    const url = join(process.cwd(), mod.filepath) + (is_prod ? '' : '?' + Math.random())
    const fns = await import(url)
    await fns.default?.(data)
  }

  return data
}





