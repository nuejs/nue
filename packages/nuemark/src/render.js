import { tags, elem, join } from './tags.js'
import { parsePage, parseHeading } from './parse.js'
import { marked } from 'marked'


/*
  ":" prefix support for property names, for example:

  [image-gallery :items="gallery"]
*/
function extractData(to, from) {
  for (const key in from) {
    if (key[0] == ':') {
      const name = key.slice(1)
      to[name] = to[from[key]]
    } else {
      to[key] = from[key]
    }
  }
  return to
}

export function renderPage(page, opts) {
  const { lib = [] } = opts
  const data = { ...opts.data, ...page.meta }
  const draw_sections = opts.draw_sections
  const custom_tags = opts.tags || {}
  const ret = []

  delete opts.draw_sections

  page.sections.forEach((section, i) => {

    const html = join(section.blocks.map(el => {
      const { name, md, attr } = el
      const comp = name && lib.find(el => [name, toCamelCase(name)].includes(el.name))
      const alldata = extractData({ ...data, attr }, el.data)
      const tag = custom_tags[name] || tags[name]

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

    const attr = section.attr || {}
    const classes = data.section_classes
    if (classes && !attr.class) attr.class = classes[i]
    attr.is = data.section_component
    ret.push(draw_sections ? elem('section', attr, html) : html)

  })

  return { ...page, html: join(ret) }
}

function toCamelCase(str) {
  return str.split('-').map(el => el[0].toUpperCase() + el.slice(1)).join('')
}

export function renderLines(lines, opts = {}) {
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
    const { href, title = '' } = links[key]
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


export function renderHeading(html, depth, raw) {
  const plain = parseHeading(raw)
  const { id } = plain

  // class name only
  if (!id && plain.class) return elem(`h${depth}`, { class: plain.class }, plain.text)

  // no id -> return plain heading
  if (!id || depth == 1) return elem(`h${depth}`, html)

  // id given
  const title = plain.text.replaceAll('"', '')
  const { text } = parseHeading(html)

  delete plain.text
  const a = elem('a', { href: `#${id}`, title })
  return elem(`h${depth}`, plain, a + text)
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
