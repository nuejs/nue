
import { tags, elem, join, concat } from './tags.js'
import { parsePage, parseHeading } from './parse.js'
import { parseAttr } from './component.js'
import { marked } from 'marked'


export function renderPage(page, opts) {
  const { lib=[] } = opts
  const data = { ...opts.data, ...page.meta }
  const draw_sections = data?.draw_sections || page.sections[1]
  const section_attr = data.sections || []
  const ret = []


  // section_attr
  page.sections.forEach((section, i) => {

    const html = join(section.blocks.map(el => {
      const { name, md, attr } = el
      const comp = name && lib.find(el => [name, toCamelCase(name)].includes(el.name))
      const alldata = { ...data, ...el.data, attr }
      const tag = tags[name]

      // tag
      return tag ? tag(alldata, opts) :

        el.is_code ? tags.code({ ...data, language: el.name, ...el }) :

        // component
        comp ? comp.render(alldata, lib) :

        // markdown
        md ? renderMarkdown(md, mergeLinks(page.links, data.links)) :

        // island
        name ? renderIsland(el) :

        // generic layout
        tags.layout(alldata, opts)

    }))

    const attr = section.attr || parseAttr(section_attr[i] || '')
    ret.push(draw_sections ? elem('section', attr, html) : html)

  })

  return { ...page, html: join(ret) }
}

function toCamelCase(str) {
  return str.split('-').map(el => el[0].toUpperCase() + el.slice(1)).join('')
}

export function renderLines(lines, opts={}) {
  const page = parsePage(lines)
  return renderPage(page, opts)
}

export function renderIsland({ name, attr, data }) {
  const json = !Object.keys(data)[0] ? '' : elem('script',
    { type: 'application/json' }, JSON.stringify(data)
  )
  return elem('div', { ...attr, is: name }, json)
}

/*
  Sadly, Marked does not have a modifiable abstract syntax tree (AST) so
  internally we must render all markdown blocks twice:

  https://github.com/markedjs/marked/issues/3135

  Looking for other Markdown implementations if this becomes a performance bottleneck.
*/
export function renderMarkdown(md, links) {
  md.push('')

  for (const key in links) {
    const { href, title='' } = links[key]
    md.push(`[${key}]: ${href} "${title}"`)
  }
  return marked.parse(join(md))
}

function mergeLinks(a, b) {
  for (const key in b) a[key] = parseLink(b[key])
  return a
}

function parseLink(href) {
  const i = href.indexOf('"')
  const title = i > 1 ? href.trim().slice(i + 1, -1) : undefined
  if (title) href = href.slice(0, i)
  return { href, title }
}

marked.setOptions({
  smartypants: true,
  headerIds: false,
  smartLists: false,
  mangle: false
})

export function renderHeading(html, level, raw) {
  const plain = parseHeading(raw)
  const { id } = plain

  // no id -> return plain heading
  if (!id) return elem(`h${level}`, html)

  // id given
  const title = plain.text.replaceAll('"', '')
  const { text } = parseHeading(html)

  delete plain.text
  const a = elem('a', { href: `#${id}`, title })
  return elem(`h${level}`, plain, a + text)
}

// marked renderers
const renderer = {

  heading: renderHeading,

  // lazyload images by default
  image(src, title, alt) {
    return elem('img', { src, title, alt, loading: 'lazy' })
  },
}

marked.use({ renderer })
