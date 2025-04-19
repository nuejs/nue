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

  const { scripts = [], styles = [], inline_css = [], components = [] } = data.assets || {}

  const head = []

  // helpers
  const pushEl = (name, attr, body) => head.push(elem(name, attr, body))
  const pushMeta = (key, val, type = 'name') => val && head.push(elem('meta', { [type]: key, content: val }))
  const pushProp = (key, val) => pushMeta(key, val, 'property')

  // top
  pushEl('meta', { charset })
  pushMeta('viewport', viewport)
  if (title) pushEl('title', title_template.replace(/%s/gi, title))
  if (favicon) pushEl('link', { rel: 'icon', type: getMime(favicon), href: favicon })

  // module scripts
  scripts.forEach(src => pushEl('script', { src: base + src, type: 'module' }))

  // inline style
  if (is_prod) {
    const css = inline_css.map(el => el.css).join('')
    pushEl('style', css)

    // dev mode: keep path info for hot-reloading
  } else {
    inline_css.forEach(el => pushEl('style', { href: base + el.path }, el.css))
  }

  // external stylesheets
  styles.forEach(href => pushEl('link', { href: base + href, rel: 'stylesheet' }))

  // CSS prefetch
  prefetch.forEach(href => {
    const is_image = getMime(href).startsWith('image')
    const load_type = is_image ? { rel: 'preload', as: 'image' } : { rel: 'prefetch' }
    pushEl('link', { href: base + href, ...load_type })
  })

  if (version) pushMeta('generator', generator)
  const desc = data.desc || data.description
  pushMeta('date.updated', new Date().toISOString())
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

  return head.join('\n')
}
