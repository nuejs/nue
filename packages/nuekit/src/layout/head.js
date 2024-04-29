
import { TYPES } from '../nueserver.js'
import { extname } from 'node:path'

export function renderHead(data) {
  const {
    version     = data.nuekit_version,
    generator   = `Nue v${version} (nuejs.org)`,
    viewport    = 'width=device-width,initial-scale=1',
    charset     = 'utf-8',
    title_template = '%s',
    scripts     = [],
    styles      = [],
    inline_css  = [],
    prefetch    = [],
    base        = '',
    origin      = '',
    components,
    favicon,
    title

  } = data

  const head = [`<meta charset="${charset}">`]
  if (title) head.push(`<title>${title_template.replace(/%s/gi, title)}</title>`)

  // meta
  const pushMeta = (key, val) => val && head.push(`<meta name="${key}" content="${val}">`)

  if (version) pushMeta('generator', generator)
  pushMeta('date.updated', new Date().toISOString())
  pushMeta('viewport', viewport)
  pushMeta('description', data.description)
  pushMeta('author', data.author)
  pushMeta('robots', data.robots)
  pushMeta('theme-color', data.theme_color)

  // OG image
  const og = data.og_image || data.og
  if (og) {
    let img = og[0] == '/' ? og : `/${data.dir}/${og}`
    head.push(`<meta property="og:image" content="${origin}${img}">`)
  }

  // preload image
  const pi = data.preload_image
  if (pi) head.push(`<link rel="preload" as="image" href="${pi}">`)

  // Pub date
  const pub = data.pubDate
  if (pub) head.push(`<meta property="article:published_time" content="${pub}">`)

  // components
  if (components) pushMeta('nue:components', components.map(uri => `${base}${uri}`).join(' '))

  // misc
  if (favicon) head.push(`<link rel="icon" type="${TYPES[extname(favicon).slice(1)]}" href="${favicon}">`)

  // inline style
  inline_css.forEach(el => head.push(`<style href="${base}${el.path}">${ el.css }</style>`))

  // stylesheets
  styles.forEach(href => head.push(`<link href="${base}${href}" rel="stylesheet">`))

  // scripts (type=module)
  scripts.forEach(src => head.push(`<script src="${base}${src}" type="module"></script>`))

  // CSS prefetch
  prefetch.forEach(href => head.push(`<link rel="prefetch" href="${base}${href}">`))


  return head.join('\n')
}

