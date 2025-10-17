
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const CONF = [
  'site', 'is_prod', 'design', 'server', 'collections', 'production', 'sitemap', 'rss',
  'include', 'exclude', 'meta', 'content', 'import_map', 'svg', 'links'
]


export async function getConf(app, chain, assets, is_prod) {
  const conf = { is_prod }

  for (const sitename of chain.toReversed()) {
    const file = assets.get(`${sitename}/site.yaml`)
    if (file) Object.assign(conf, await file.parse())
  }

  for (const sitename of chain.toReversed()) {
    const file = assets.get(`${sitename}/${app}/app.yaml`)
    if (file) Object.assign(conf, await file.parse())
  }

  Object.keys(conf).forEach(key => {
    if (!CONF.includes(key)) delete conf[key]
  })

  return conf
}


export async function getData(deps, is_prod) {
  const data = { is_prod }

  for (const dep of deps.filter(el => el.is_yaml)) {
    const yaml = await dep.parse()
    if (is_prod && yaml.meta) Object.assign(yaml.meta, yaml.production)

    Object.entries(yaml).forEach(([key, val]) => {
      if (key == 'meta') return Object.assign(data, val)
      else if (!CONF.includes(key)) data[key] = val
    })
  }

  return data
}

