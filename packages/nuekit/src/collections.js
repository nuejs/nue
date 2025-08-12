
export async function getCollections(pages, opts) {
  const collections = {}

  for (const [name, conf] of Object.entries(opts)) {
    let matchedPages = matchPages(pages, conf.match)
    let filteredPages = await filterPages(matchedPages, conf)
    let sortedPages = sortPages(filteredPages, conf.sort)

    collections[name] = sortedPages
  }

  return collections
}

function matchPages(pages, patterns) {
  const ret = []

  for (const pattern of patterns) {
    const glob = new Bun.Glob(pattern)

    for (const page of pages) {
      if (glob.match(page.path)) ret.push(page)
    }
  }

  return ret
}

async function filterPages(pages, config) {
  const ret = []

  for (const page of pages) {
    const { meta } = await page.document()

    if (config.require) {
      const hasRequired = config.require.every(field => meta[field] != null)
      if (!hasRequired) continue
    }

    if (config.skip) {
      const shouldSkip = config.skip.some(field => meta[field])
      if (shouldSkip) continue
    }
    const { url, dir, slug } = page
    ret.push({ ...meta, url, dir, slug })
  }

  return ret
}

function sortPages(pages, sorting) {
  if (!sorting) return pages

  const [field, direction = 'asc'] = sorting.split(' ')

  return pages.toSorted((a, b) => {
    const aVal = a[field]
    const bVal = b[field]
    const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return direction == 'desc' ? -result : result
  })
}
