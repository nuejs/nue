
import { parse, sep } from 'node:path'
import { parseNue } from 'nuedom'
import { parseNuemark } from 'nuemark'
import { parseYAML } from 'nueyaml'

const parsers = {
  md: parseNuemark,
  yaml: parseYAML,
  html: parseNue,
  json: text => JSON.parse(text)
}

export function createAsset(filepath, sitename) {
  const asset = getPathInfo(filepath, sitename)
  const file = Bun.file(filepath)
  const cached = {}

  async function text() {
    return cached.text ??= await file.text()
  }

  async function parse() {
    const content = await text()
    return cached.obj ??= parsers[asset.type]?.(content) ?? content
  }

  return { ...asset, file, text, parse }
}

// single-site mode --> @base
export function getPathInfo(filepath, sitename='@base') {
  const parts = filepath.split(sep)
  const siteIndex = parts.indexOf(sitename)

  const folder = siteIndex > 0 ? parts.slice(0, siteIndex).join(sep) : null
  const pathParts = parts.slice(siteIndex + 1)
  const path = pathParts.join(sep)

  const info = parse(path)
  const type = info.ext.slice(1)
  const app = pathParts.length > 1 ? pathParts[0] : null
  const is_spa = !path.includes('@') && path.endsWith('index.html')


  return {
    name: info.name,
    base: info.base,
    dir: info.dir,
    ext: info.ext,

    is_base: sitename == '@base',
    [`is_${type}`]: true,
    slug: getSlug(info),
    url: getURL(info),
    site: sitename,
    is_spa,
    folder,
    path,
    type,
    app,
  }
}


export function getURL(info) {
  let { name, base, ext, dir } = info

  if (['.md', '.html'].includes(ext)) {
    if (name == 'index') name = ''
    ext = ''
  }

  if (ext == '.ts') ext = '.js'
  const els = dir.split(sep)
  els.push(name + ext)

  return `/${ els.join('/') }`.replace('//', '/')
}

export function getSlug(info) {
  let { name, base, ext } = info
  return name == 'index' ? '' : ext == '.md' ? name : base
}


