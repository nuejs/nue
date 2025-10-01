
// assumes is_md
export async function getCollections(files, opts) {
  const arr = {}

  for (const [name, conf] of Object.entries(opts)) {
    arr[name] = await createCollection(files, conf)
  }

  return arr
}

export async function createCollection(files, conf) {
  let matchedPages = matchPages(files, conf.include)
  let filteredPages = await filterPages(matchedPages, conf)
  return sortPages(filteredPages, conf.sort)
}

function matchPages(files, patterns=[]) {
  const ret = []

  for (const pattern of patterns) {
    for (const page of files) {
      if (page.path.includes(pattern)) ret.push(page)
    }
  }

  return ret
}

async function filterPages(files, conf) {
  const ret = []

  for (const page of files) {
    const { meta } = await page.parse()

    // require?
    if (conf.require && !conf.require.every(field => meta[field])) continue

    // tags?
    if (conf.tags && !conf.tags.some(tag => meta.tags?.includes(tag))) continue

    // skip?
    if (conf.skip?.some(field => meta[field])) continue

    const { url, dir, slug } = page
    ret.push({ ...meta, url, dir, slug })
  }

  return ret
}

function sortPages(files, sorting) {
  if (!sorting) return files

  const [field, direction = 'asc'] = sorting.split(' ')

  return files.toSorted((a, b) => {
    const aVal = a[field]
    const bVal = b[field]
    const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return direction == 'desc' ? -result : result
  })
}
