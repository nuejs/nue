
import { extname } from 'node:path'

import { elem } from 'nuemark'

import { TYPES } from '../nueserver.js'


function getMime(path) {
  const ext = extname(path).slice(1)
  return TYPES[ext] || ''
}

export function renderHead(data) {
  const {
    version    = data.nuekit_version,
    generator  = `Nue v${version} (nuejs.org)`,
    viewport   = 'width=device-width,initial-scale=1',
    charset    = 'utf-8',
    title_template = '%s',
    prefetch   = [],
    base       = '',
    origin     = '',
    favicon,
    title,
    is_prod,
  } = data

  const { scripts=[], styles=[], inline_css=[], components=[] } = data.assets || {}

  const head = [`<meta charset="${charset}">`]
  if (title) head.push(elem('title', title_template.replace(/%s/gi, title)))

  // meta
  const pushMeta = (key, val, type = 'name') => val && head.push(elem('meta', { [type]: key, content: val }))
  const pushProp = (key, val) => pushMeta(key, val, 'property')

  if (version) pushMeta('generator', generator)
  const desc = data.desc || data.description
  pushMeta('date.updated', new Date().toISOString())
  pushMeta('viewport', viewport)
  pushMeta('description', desc)
  pushMeta('author', data.author)
  pushMeta('robots', data.robots)
  pushMeta('theme-color', data.theme_color)

  // OG data
  pushProp('og:title', title)
  pushProp('og:description', desc)

  const og = data.og_image || data.og
  if (og) {
    const img = og[0] == '/' ? og : `/${data.dir}/${og}`
    pushProp('og:image', origin + img)
  }

  // Pub date
  pushProp('article:published_time', data.date || data.pubDate)

  // components (must always be rendered)
  pushMeta('nue:components', components.map(uri => `${base}${uri}`).join(' ') || ' ')

  // helper info for hot-reloading
  if (!is_prod) {
    for (const key of 'include exclude globals libs'.split(' ')) {
      const arr = data[key]
      pushMeta(`nue:${key}`, arr?.join(' '))
    }
  }

  // misc
  if (favicon) head.push(`<link rel="icon" type="${getMime(favicon)}" href="${favicon}">`)

  // inline style
  if (is_prod) {
    const css = inline_css.map(el => el.css).join('')
    head.push(elem('style', css))

  // dev mode: keep path info for hot-reloading
  } else {
    inline_css.forEach(el => head.push(elem('style', { href: base + el.path }, el.css)))
  }

  // external stylesheets
  styles.forEach(href => head.push(`<link href="${base}${href}" rel="stylesheet">`))

  // scripts (type=module)
  scripts.forEach(src => head.push(`<script src="${base}${src}" type="module"></script>`))

  // CSS prefetch
  prefetch.forEach(href => {
    const is_image = getMime(href).startsWith('image')
    head.push(`<link href="${base}${href}" ${is_image ? 'rel="preload" as="image"' : 'rel="prefetch"'}>`)
  })

  return head.join('\n')
}
