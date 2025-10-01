
export default function(data) {
  const { topics } = data

  data.getTopicCategory = function(slug) {
    return getCategory(topics, slug)
  }

  // translate topic entries
  for (const [cat, items] of Object.entries(topics)) {
    if (!topics[cat][0]?.title) topics[cat] = items.map(parseEntry)
  }
}

export function getCategory(topics, slug) {
  for (const category in topics) {
    for (const item of topics[category]) {
      if (slug == item.slug) return category
    }
  }
}

export function parseEntry(el) {
  const [content, explicitSlug] = el.split(' | ')

  // Split content by / to separate title and desc
  const [title, desc = ''] = content.split(' / ')

  // Use explicit slug or generate from title
  const slug = explicitSlug || title.toLowerCase().replaceAll(' ', '-')

  return { title: title.trim(), desc: desc.trim(), slug: slug.trim() }
}


