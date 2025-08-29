
import { mkdir, rmdir, writeFile, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'os'

import { generateSitemap, generateFeed } from '../render/feed'
import { createSystemFiles } from '../system'

export async function build(site, args) {
  const { paths=[], dryrun, silent } = args
  const { conf, assets } = site
  const { dist } = conf

  // subset
  const subset = paths.length ? assets.filter(el => matches(el.path, paths)) : assets

  if (dryrun) {
    subset.filter(el => !el.is_yaml).forEach(el => console.log(el.path))
    return subset
  }

  // build subset
  const start = performance.now()
  await buildAll(subset, { ...args, dist })

  // sitemap.xml
  if (!paths.length && conf.sitemap?.enabled) {
    const xml = await generateSitemap(assets, conf)
    if (xml) await writeFile(join(dist, 'sitemap.xml'), xml)
  }

  // feed.xml
  if (!paths.length && conf.rss?.enabled) {
    const xml = await generateFeed(assets, conf)
    if (xml) await writeFile(join(dist, 'feed.xml'), xml)
  }

  // stats
  if (!silent) {
    stats(subset).forEach(line => console.log(line))
    const time = Math.round(performance.now() - start)
    console.log(`-----\nBuilt in: ${time}ms\n`)
  }
}


export async function buildAll(subset, args) {
  const { dist, init, verbose, clean } = args

  // .dist directory
  if (clean) await rmdir(dist, { recursive: true, force: true })
  await mkdir(dist, { recursive: true })

  // .dist/@nue directory
  await createSystemFiles(dist, init)

  // build files
  subset = subset.filter(el => !el.is_yaml)

  await Promise.all(subset.map(async asset => {
    try {
      if (verbose) console.log(asset.path)
      await buildAsset(asset, dist)

    } catch (error) {
      console.error(`Failed to build ${asset.path}:`, error)
      throw error // or return null to continue with others
    }
  }))
}

export async function buildAsset(asset, dist) {
  const result = await asset.render()

  if (result?.js) {
    const minified = await minifyJS(result.js)
    await asset.write(dist, minified, '.html.js')
  }

  if (result?.html) await asset.write(dist, result.html)

  if (typeof result == 'string') {
    await asset.write(dist, result, await asset.toExt())

  } else if (!asset.is_html) {
    await asset.copy(dist)
  }
}


// TODO: layout and colors
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

async function minifyJS(code) {
  const path = join(tmpdir(), `temp-${Date.now()}.js`)
  await writeFile(path, code)

  const result = await Bun.build({
    entrypoints: [path],
    external: ['*'],
    minify: true
  })

  await unlink(path)
  return await result.outputs[0].text()
}
