
// assumes is_md
export async function getCollections(assets, opts) {
  const arr = {}

  for (const [name, conf] of Object.entries(opts)) {
    arr[name] = await createCollection(assets, conf)
  }

  return arr
}

export async function createCollection(assets, conf) {
  let matchedPages = matchPages(assets, conf.include)
  let filteredPages = await filterPages(matchedPages, conf)
  return sortPages(filteredPages, conf.sort)
}

function matchPages(assets, patterns=[]) {
  const ret = []

  for (const pattern of patterns) {
    for (const page of assets) {
      if (page.path.includes(pattern)) ret.push(page)
    }
  }

  return ret
}

async function filterPages(assets, conf) {
  const ret = []

  for (const page of assets) {
    const { meta } = await page.parse()

    // require?
    if (conf.require && !conf.require.every(field => meta[field])) continue

    // skip?
    if (conf.skip?.some(field => meta[field])) continue

    const { url, dir, slug } = page
    ret.push({ ...meta, url, dir, slug })
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
