
// assumes is_md
export async function getCollections(assets, coll_conf, chain) {
  if (!coll_conf) return

  const data = {}

  for (const [name, conf] of Object.entries(coll_conf)) {
    data[name] = await createCollection(assets, conf, chain)
  }

  return data
}

export async function createCollection(assets, conf, chain=[null]) {

  for (const site of chain.toReversed()) {
    const matchedPages = matchPages(assets, conf.include, site)
    const pages = await filterPages(matchedPages, conf)
    if (pages.length) return sortPages(pages, conf.sort)
  }

  return []
}

function matchPages(assets, patterns=[], site) {
  const ret = []

  for (const pattern of patterns) {
    for (const page of assets) {
      if ((!site || page.site == site) && page.path.includes(pattern)) ret.push(page)
    }
  }

  return ret
}

async function filterPages(assets, conf) {
  const ret = []

  for (const page of assets) {
    const { meta={} } = await page.parse()

    // non-markdown
    if (!page.is_md) continue

    // require?
    if (conf.require && !conf.require.every(field => meta[field])) continue

    // tags?
    if (conf.tags && !conf.tags.some(tag => meta.tags?.includes(tag))) continue

    // skip?
    if (conf.skip?.some(field => meta[field])) continue

    const { url, dir, slug, mtime } = page
    ret.push({ ...meta, url, dir, slug, mtime })
  }

  return ret
}

function sortPages(assets, sorting) {
  if (!sorting) return assets

  const [field, direction = 'asc'] = sorting.split(' ')

  return assets.toSorted((a, b) => {
    const aVal = a[field]
    const bVal = b[field]
    const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return direction == 'desc' ? -result : result
  })
}
