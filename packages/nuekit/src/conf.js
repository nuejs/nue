
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

import { parseYAML } from 'nueyaml'

// configuration properties (separate from data)
const SITE_CONF = 'site design server collections production port sitemap'.split(' ')

const ALL_CONF = SITE_CONF.concat('include exclude meta content import_map svg'.split(' '))

// default skip list
const SKIP = `node_modules .toml .rs .lock package.json .lockb lock.yaml README.md Makefile`.split(' ')


export async function readSiteConf(args={}) {
  const { is_prod=false, port, root='.' } = args
  const files = await readdir(root)

  let conf = {}

  if (files.includes('site.yaml')) {
    const file = Bun.file(join(root, 'site.yaml'))
    conf = await parseYAML(await file.text())

  } else {
    const index = files.find(name => ['index.md', 'index.html'].includes(name))
    if (!index) return null
  }

  // build ignore list into config
  const ignore = [...SKIP, ...(conf.site?.skip || [])]
  ignore.push(conf.server?.dir || join('@shared', 'server'))
  ignore.push(join('@shared', 'test'))

  // production override
  if (is_prod) {
    Object.assign(conf.meta, conf.production)
    delete conf.production
  }

  if (port) conf.port = port

  // dist
  conf.dist = join(root, '.dist')

  return { ...conf, is_prod, root, ignore }
}


export function mergeData(dataset) {
  const ret = {}

  dataset.forEach(data => {
    data && Object.entries(data).forEach(([key, val]) => {
      if (key == 'meta') return Object.assign(ret, val)
      if (!ALL_CONF.includes(key)) ret[key] = val
    })
  })

  return ret
}

export function mergeConf(site_conf, app_conf) {
  const conf = structuredClone(site_conf)
  for (const key in app_conf) mergeValue(conf, key, app_conf[key])
  return conf
}

export function mergeValue(conf, key, val) {

  if (!ALL_CONF.includes(key) || SITE_CONF.includes(key)) return

  // merge meta / content
  if (['meta', 'content'].includes(key) && typeof val == 'object') {
    return conf[key] = { ...conf[key], ...val }
  }

  // override (include, exclude, import_map)
  return conf[key] = val
}

