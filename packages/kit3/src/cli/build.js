
import { styleText as color } from 'node:util'
import { readNueAsset } from '../render/asset'
import { createTree } from '../tree'
import { join } from 'path'

export async function getBuildables(tree, args) {

  // buildables
  const buildables = filterBuildables(tree.getAll(), await getLastDeployTime(), args)

  // more
  const more = await getMore(tree, buildables)
  return unique([ ...buildables, ...more ])
}


function unique(assets) {
  const seen = new Set()

  return assets.filter(asset => {
    const key = asset.site + ':' + asset.path
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}


async function setHTMLProps(assets) {
  const html_files = assets.filter(el => el.is_html)

  for (const asset of html_files) {
    const ast = await asset.parse()
    const dhtml = ast.is_dhtml

    if (ast.is_lib) {
      asset.is_dhtml_lib = dhtml
      asset.is_html_lib = !dhtml
    } else if (dhtml) {
      asset.is_spa = true
    }
  }

}


function getSites(buildables) {
  return [...new Set(buildables.map(b => b.site))]
}

function filterBuildables(assets, last_deploy, args) {
  const { paths, no_media } = args

  return assets.filter(asset => {

    // skip media
    if (no_media && isMedia(asset.file.type)) return false

    // max size 2MB
    if (asset.file.size > 2_000_000) {
      const pretty = formatSize(asset.file.size)
      console.warn(`Skipping ${asset.path} (${pretty}). Max file size 2MB`)
      return false
    }

    // all
    if (args.all) return true

    // updated files only
    if (last_deploy && !args.force && asset.file.lastModified < last_deploy) return false

    // matches only
    if (paths.length) return paths.some(match => asset.filepath.includes(match))


    return true

  })
}


async function getMore(tree, buildables) {
  const more = []
  const assets = tree.getAll()
  await setHTMLProps(assets)

  // loop sites
  const sites = getSites(buildables)

  for (const site of sites) {
    const chain = await tree.getChain(site)
    more.push(...getAffectedPages(site, chain, assets, buildables))
    more.push(...getInheritedContent(site, chain, buildables))
    more.push(...getSharedAssets(site, chain, buildables))
  }

  return more
}


export function getAffectedPages(site, chain, assets, buildables) {
  const deps = buildables.filter(a => a.is_css || a.is_yaml || a.is_html_lib)
  const pages = assets.filter(a => a.site == site && a.is_md)

  return pages.filter(page => {

    return deps.some(asset => {
      // asset must be in my chain
      if (!chain.includes(asset.site)) return false

      // asset scope must include this page
      return !asset.app || asset.app == '@shared' || page.app && page.app == asset.app
    })
  })
}

export function getSharedAssets(site, chain, buildables) {

  // find shared assets in chain (JS, fonts, client components)
  const more = buildables.filter(a =>
    (a.is_js || a.is_ts || a.is_woff2 || a.is_dhtml_lib) &&
    (!a.app || a.app == '@shared') &&
    chain.includes(a.site) &&
    a.site != site
  )

  return more.map(asset => ({ ...asset, site, orig: asset.site }))
}

export function getInheritedContent(site, chain, buildables) {
  const sitePages = buildables.filter(a => a.site == site && a.is_md)
  const siteDirs = [...new Set(sitePages.map(p => p.dir))]

  // find changed content in chain (excluding site itself)
  const more = buildables.filter(a =>
    a.is_md &&
    chain.includes(a.site) &&
    a.site != site &&
    !siteDirs.includes(a.dir) // site has no content in this dir
  )

  return more.map(asset => ({ ...asset, site, orig: asset.site }))
}


export async function build(tree, args) {
  const all = await getBuildables(tree, args)
  const { dryrun, verbose, silent, init } = args
  const buildables = all.filter(el => !(el.is_css || el.is_yaml || el.is_html_lib || el.site == '@base'))

  // --dryrun
  if (dryrun) {
    buildables.forEach(asset => log(asset))
    return console.log('\n   ' + buildables.length, 'files' + '\n')
  }

  const sites = getSites(buildables.filter(el => el.is_md))

  if (init) {
    for (const site of sites) await buildNueAssets(site)
    return
  }

  if (!silent) {
    const am = sites.length
    console.log(`   Building ${am} site${am == 1 ? '' : 's'}`)
    printSummaryTable(buildables)
  }


  await Promise.all(buildables.map(async asset => {
    await tree.buildAsset(asset)
    if (verbose) log(asset)
  }))

  // build sitemap & RSS if content has changed
  for (const site of sites) {
    await tree.buildFeed(site, 'sitemap.xml')
    await tree.buildFeed(site, 'feed.xml')
  }

  await saveLastDeployTime()

  console.log('\n')

  return { sites, buildables }
}


export async function buildNueAssets(site) {
  for (const name of ['transitions.js', 'mount.js', 'state.js', 'nue.js']) {
    const js = await readNueAsset(name, true)
    const file = Bun.file(join('.dist', site, '@nue', name))
    await file.write(js)
  }
}


export function log(asset, tint='green') {
  const path = asset.site + '/' + asset.path
  const orig = asset.orig ? ' ' + asset.orig + color('green', ' →') : ''
  console.log(`   ${color(tint, '⇒') } ${ orig } ${color('gray', path) }`)
}

export function printSummaryTable(assets) {
  const names = assets.map(el => el.site)
  const counts = {}
  for (const name of names) counts[name] = (counts[name] || 0) + 1
  const maxLen = Math.max(...Object.keys(counts).map(n => n.length))

  const sorted = Object.entries(counts).sort(([a], [b]) => {
    if (a == '@base') return -1
    if (b == '@base') return 1
    return counts[b] - counts[a]
  })

  for (const [name, count] of sorted) {
    const files = count == 1 ? 'file' : 'files'
    const site = color('gray', name.padEnd(maxLen + 10))
    console.log(`   ${site}${count} ${files}`)
  }
}


function isMedia(mime) {
  return mime.includes('image') || mime.includes('video')
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
}


const timestamp = Bun.file(join('.dist', 'timestamp.txt'))

async function saveLastDeployTime() {
  const now = Date.now()
  await timestamp.write(now)
  return now
}

async function getLastDeployTime() {
  try {
    return 1 * await timestamp.text()
  } catch (e) {
    return await saveLastDeployTime()
  }
}


