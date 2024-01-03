import { extname } from 'node:path'
import { TYPES } from './nueserver.js'

export function renderHead(data, is_prod) {
  const {
    viewport    = 'width=device-width,initial-scale=1',
    generator   = 'Nue (nuejs.org)',
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

  if (is_prod) {
    pushMeta('generator', generator)
    pushMeta('date.updated', new Date().toISOString())
  }

  pushMeta('viewport', viewport)
  pushMeta('description', data.description)
  pushMeta('author', data.author)
  pushMeta('robots', data.robots)
  pushMeta('theme-color', data.theme_color)

  // OG image
  const og = data.og_image
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
  if (favicon) head.push(`<link rel="shortcut icon" type="${TYPES[extname(favicon).slice(1)]}" src="${favicon}">`)

  // inline style
  inline_css.forEach(css => head.push(`<style href="${base}${css.path}">${ css.content }</style>`))

  // stylesheets
  styles.forEach(href => head.push(`<link href="${base}${href}" rel="stylesheet">`))

  // scripts (type=module)
  scripts.forEach(src => head.push(`<script src="${base}${src}" type="module"></script>`))

  // CSS prefetch
  prefetch.forEach(href => head.push(`<link rel="prefetch" href="${base}${href}">`))


  return head.join('\n')
}


export function getDefaultHTML(data) {
  const { language='en', direction='ltr' } = data
  const klass = data.class ? ` class="${data.class}"` : ''

  return `
<html lang="${language}" dir="${direction}">

  <head>
    <slot for="head"/>
    <slot for="custom_head"/>
  </head>

  <body${klass}>
    <slot for="header"/>
    <slot for="main"/>
    <slot for="footer"/>
  </body>

</html>
`
}

export function getDefaultSPA(body='', data) {
  const { language='en-US', direction='ltr' } = data

  return `
<html lang="${language}" dir="${direction}">
  <head>
    <slot for="head"/>
  </head>

  <body>
    ${body}
  </body>
</html>
`
}


