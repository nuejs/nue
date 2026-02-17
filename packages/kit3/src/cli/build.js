
import { join } from 'path'
import { styleText as color } from 'node:util'
import { readNueAsset } from '../render/asset'
import { getDeps } from '../deps'


export async function getBuildables(tree, args) {
  const assets = tree.getAll()
  await setHelperProps(assets)
  const result = []

  for (const site of getSites(assets)) {
    const chain = await tree.getChain(site)
    const since = args.force ? 0 : await getLastDeployTime(site)
    const changedCss = []

    for (const a of assets) {
      if (a.is_yaml || a.is_html_lib) continue
      if (!chain.includes(a.site)) continue
      if (!args.all && a.file.lastModified <= since) continue
      if (a.is_page && !shouldIncludePage(a, site, assets)) continue
      if (args.paths?.length && !args.paths.some(p => a.filepath.includes(p))) continue
      if (args.no_media && isMedia(a.file.type)) continue
      if (a.file.size > 2_000_000) continue
      if (a.is_css) { changedCss.push(a); continue }

      result.push({ ...a, site })
    }

    // page dependencies
    for (const page of assets.filter(el => el.is_page)) {
      if (!chain.includes(page.site)) continue
      if (!shouldIncludePage(page, site, assets)) continue

      const deps = await getDeps(page, chain, assets)

      // rebuild page if css dep changed
      if (hasCSSDep(deps, changedCss)) result.push({ ...page, site })

      // include linked deps that changed
      for (const d of deps) {
        if (!(d.is_js || d.is_ts || d.is_dhtml_lib)) continue
        if (!args.all && d.file.lastModified <= since) continue
        if (args.paths?.length) continue
        result.push({ ...d, site })
      }
    }
  }

  return unique(result).filter(el => args.site ? el.site == args.site : true)
}


export function shouldIncludePage(a, site, assets) {
  if (a.site == site) return true

  // site has this page locally?
  if (assets.some(b => b.site == site && b.is_page && b.url == a.url)) return false

  // favor .html over .md at same URL
  if (a.is_md && assets.some(b => b.is_page && b.is_html && b.url == a.url)) return false

  // root pages inherit
  if (!a.app) return true

  // app pages: only if site has that app
  return assets.some(b => b.site == site && b.app == a.app)
}


export function hasCSSDep(deps, changedCss) {
  return deps.some(d => d.is_css && changedCss.some(c => c.path == d.path && c.site == d.site))
}


async function setHelperProps(assets) {
  const html_files = assets.filter(a => a.is_html)
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

  // set is_page
  for (const a of assets) {
    a.is_page = a.is_md || a.is_spa
  }
}

export function unique(assets) {
  const seen = new Set()
  return assets.filter(a => {
    const key = a.site + ':' + a.path
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}


export async function build(tree, args) {
  const buildables = await getBuildables(tree, args)
  const { dryrun, verbose, silent } = args
  const sites = getSites(buildables)

  if (dryrun) {
    buildables.forEach(a => log(a))
    console.log('\n   ' + buildables.length, 'files\n')
    return
  }

  if (!silent) {
    console.log(`   Building ${sites.length} site${sites.length == 1 ? '' : 's'}`)
    printSummary(buildables)
  }

  // build assets
  await Promise.all(buildables.map(async asset => {
    await tree.buildAsset(asset)
    if (verbose) log(asset)
  }))

  // @nue folder, sitemap & rss
  for (const site of sites) {
    await buildNueAssets(site, silent)
    await tree.buildFeed(site, 'sitemap.xml')
    await tree.buildFeed(site, 'feed.xml')
  }

  console.log('\n')
  return { sites, buildables }
}

export function getSites(assets) {
  return [...new Set(assets.map(a => a.site))].filter(s => s != '@base')
}

export async function buildNueAssets(site, silent) {
  const names = ['transitions.js', 'mount.js', 'state.js', 'nue.js']
  for (const name of names) {
    const js = await readNueAsset(name, true)
    const path = join('.dist', site, '@nue', name)
    await Bun.file(path).write(js)
    if (!silent) log({ site, path })
  }
}


export function log(asset, tint = 'green') {
  const path = asset.site + '/' + asset.path
  const orig = asset.orig ? ' ' + asset.orig + color('green', ' →') : ''
  console.log(`   ${color(tint, '⇒')}${orig} ${color('gray', path)}`)
}


export function printSummary(assets) {
  const counts = {}
  for (const a of assets) counts[a.site] = (counts[a.site] || 0) + 1

  const maxLen = Math.max(...Object.keys(counts).map(n => n.length))
  const sorted = Object.entries(counts).sort(([a], [b]) => {
    if (a == '@base') return -1
    if (b == '@base') return 1
    return counts[b] - counts[a]
  })

  for (const [name, count] of sorted) {
    const site = color('gray', name.padEnd(maxLen + 10))
    console.log(`   ${site}${count} ${count == 1 ? 'file' : 'files'}`)
  }
}


export function isMedia(mime) {
  return mime?.includes('image') || mime?.includes('video') || false
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
}


// per-site timestamps
const getTimestampPath = site => join('.dist', site, '.timestamp')

export async function getLastDeployTime(site) {
  try {
    return 1 * await Bun.file(getTimestampPath(site)).text()
  } catch {
    return 0
  }
}

export async function saveLastDeployTime(site) {
  const now = Date.now()
  await Bun.file(getTimestampPath(site)).write(String(now))
  return now
}

