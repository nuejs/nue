
import { createCollection } from '../collections'
import { trim } from './page'

const XML = '<?xml version="1.0" encoding="UTF-8"?>'

export async function generateSitemap(assets, conf) {
  const origin = getOrigin(conf)
  const { skip } = conf.sitemap

  const pages = []

  for (const asset of assets.filter(el => el.is_md)) {
    const { meta } = await asset.parse()
    const { mtime, url } = asset

    // skip?
    if (skip?.some(field => meta[field])) continue
    pages.push({ mtime, origin, url })
  }
  return renderSitemap(pages)
}

export async function generateFeed(assets, conf) {
  const key = conf.rss.collection
  if (!key) return console.warn('rss.collection missing from site.yaml')

  const coll = conf.collections?.[key]
  const origin = getOrigin(conf)

  if (coll) {
    const pages = await createCollection(assets.filter(el => el.is_md), coll)
    return renderFeed({ ...conf.rss, origin }, pages)
  }
}


export function renderSitemap(pages) {
  const xml = [ XML, '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' ]

  pages.forEach(page => {
    if (page.url == '/404') return

    xml.push(trim(`
    <url>
      <loc>${ page.origin }${ page.url }</loc>
      <lastmod>${ page.mtime.toISOString().slice(0, 10) }</lastmod>
    </url>`))
  })

  xml.push('</urlset>')
  return xml.join('\n')
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
    const date = page.pubDate || page.date || ''
    const desc = page.description || page.desc || ''

    xml.push(trim(`
    <item>
      <title>${ page.title }</title>
      <description>${ desc }</description>
      <pubDate>${ date.toISOString?.().slice(0, 10) }</pubDate>
      <link>${ origin }${ page.url }</link>
    </item>`))
  })

  xml.push('</channel>', '</rss>')
  return xml.join('\n')
}


function getOrigin(conf) {
  const { origin='' } = conf.site || {}
  if (!origin) console.warn('site.origin missing from site.yaml')
  return origin
}