
import { parsePage, parseHeading } from './parse.js'
import { parseAttr } from './component.js'
import { tags, elem } from './tags.js'
import { marked } from 'marked'


export function renderPage(page, opts) {
  const { lib=[], highlight } = opts
  const data = { ...opts.data, ...page.meta }
  const draw_sections = data?.draw_sections || page.sections[1]
  const section_attr = data.sections || []
  const ret = []


  // syntax highlighter
  marked.setOptions({ highlight })

  // section_attr
  page.sections.forEach((section, i) => {

    const html = section.blocks.map(el => {
      const { name, md, attr } = el
      const comp = name && lib.find(el => el.name == name)
      const alldata = { ...data, ...el.data, attr }
      const tag = tags[name]

      // tag
      return tag ? tag(alldata, opts) :

        // component
        comp ? comp.render(alldata, lib) :

        // markdown
        md ? renderMarkdown(md, mergeLinks(page.links, data.links)) :

        // island
        name ? renderIsland(el) :

        // generic block
        tags.block(alldata, opts)

    }).join('\n')

    const attr = section.attr || parseAttr(section_attr[i] || '')
    ret.push(draw_sections ? elem('section', attr, html) : html)

  })

  return { ...page, html: ret.join('\n') }
}

export function renderLines(lines, opts={}) {
  const page = parsePage(lines)
  return renderPage(page, opts)
}

// export function renderPage()


export function renderIsland({ name, attr, data }) {
  const json = !Object.keys(data)[0] ? '' : elem('script',
    { type: 'application/json' }, JSON.stringify(data)
  )
  return elem('nue-island', { ...attr, island: name }, json)
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
  return marked.parse(md.join('\n'))
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

// marked renderers
const renderer = {

  heading(html, level, raw) {
    const plain = parseHeading({ text: raw })
    const rich = parseHeading({ text: html })

    return [
      `<h${level} id="${plain.id}">${rich.text}`,
      `<a href="#${plain.id}" title='Permlink for "${plain.text}"'></a>`,
      `</h${level}>\n`
    ].join('')
  },

  // lazyload images by default
  image(src, title, alt) {
    return elem('img', { src, title, alt, loading: 'lazy' })
  },
}

marked.use({ renderer })
