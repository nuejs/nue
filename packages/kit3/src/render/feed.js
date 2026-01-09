
import { createCollection } from '../collections'

const XML = '<?xml version="1.0" encoding="UTF-8"?>'


export async function generateSitemap(pages, conf) {
  const origin = getOrigin(conf)
  const { skip } = conf.sitemap

  const sitemap = []

  for (const page of pages) {
    const { meta } = await page.parse()
    const { mtime, url } = page

    // skip?
    if (skip?.some(field => meta[field])) continue
    sitemap.push({ mtime, origin, url })
  }

  return renderSitemap(sitemap)
}

export async function generateFeed(pages, conf) {
  const key = conf.rss?.collection
  if (!key) return console.warn('RSS collection missing from site.yaml')
  const coll = conf.collections?.[key]

  if (coll) {
    const origin = getOrigin(conf)
    const feed_coll = await createCollection(pages, coll)
    return renderFeed({ ...conf.rss, origin }, feed_coll)
  }
}


export function renderSitemap(pages) {
  const xml = [ XML, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' ]

  pages.forEach(page => {
    if (page.url == '/404') return

    xml.push(`
    <url>
      <loc>${ page.origin }${ page.url }</loc>
      <lastmod>${ page.mtime?.toISOString().slice(0, 10) }</lastmod>
    </url>`)
  })

  xml.push('</urlset>')
  return xml.join('').replaceAll('    ', '')
}

export function renderFeed(meta, pages) {
  const xml = [ XML, '<rss version="2.0">', '<channel>' ]
  const { title='', description='', origin } = meta

  xml.push(`
    <link>${ origin }</link>
    <title>${ title }</title>
    <description>${ description }</description>
  `)

  pages.forEach(page => {
    const date = page.pubDate || page.date || page.mtime || ''
    const desc = page.description || page.desc || ''

    xml.push(`
    <item>
      <title>${ page.title }</title>
      <description>${ desc }</description>
      <pubDate>${ date.toISOString?.().slice(0, 10) }</pubDate>
      <link>${ origin }${ page.url }</link>
    </item>`)
  })

  xml.push('</channel>', '</rss>')
  return xml.join('\n').replaceAll('    ', '')
}


function getOrigin(conf) {
  const { origin='' } = conf.site || {}
  if (!origin) console.warn('site.origin missing from site.yaml')
  return origin
}