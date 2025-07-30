
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { createSystemFiles } from './system'


export async function build(assets, opts) {
  const { paths=[], dryrun, silent } = opts

  // subset
  const subset = paths.length ? assets.filter(el => matches(el.path, paths)) : assets

  if (dryrun) {
    subset.forEach(el => console.log(el.path))
    return subset
  }

  // build subset
  const start = performance.now()
  await buildAll(subset, opts)

  // stats
  if (!silent) {
    stats(subset).forEach(line => console.log(line))
    const time = Math.round(performance.now() - start)
    console.log(`-----\nBuilt in: ${time}ms\n`)
  }
}


export async function buildAll(assets, { root, init, verbose }) {

  // .dist directory
  const dist = join(root, '.dist')
  await mkdir(dist, { recursive: true })

  // .dist/@nue directory
  await createSystemFiles(dist, init)

  // build files
  assets = assets.filter(el => !el.is_yaml)

  await Promise.all(assets.map(async asset => {
    if (verbose) console.log(asset.path)
    await buildAsset(asset, dist)
  }))
}

export async function buildAsset(asset, dist) {
  const result = await asset.render(true)

  if (result?.is_spa) {
    const { js, html } = result
    await asset.write(dist, js, '.html.js')
    await asset.write(dist, html)

  } else if (result) {
    await asset.write(dist, result, await asset.toExt())

  } else {
    await asset.copy(dist)
  }
}


export function stats(assets) {
  const lines = []

  const types = {
    md: 'Markdown',
    js: 'JavaScript',
    ts: 'TypeScript',
    html: 'HTML',
    svg: 'SVG',
    css: 'CSS',
    png: 'PNG',
    webp: 'WebP',
  }

  for (const type in types) {
    const count = assets.filter(el => el.type == type).length
    if (count) lines.push(`${types[type]} files: ${count}`)
  }

  // misc files
  const basics = ['yaml', ...Object.keys(types)]
  const count = assets.filter(el => !basics.includes(el.type)).length
  if (count) lines.push(`Misc files: ${count}`)

  return lines
}

export function matches(path, patterns) {
  return patterns.some(match => {
    return match.startsWith('./') ? path == match.slice(2) : path.includes(match)
  })
}


