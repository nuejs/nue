
import { parsePage, parseHeading } from './parse.js'
import { tags, elem } from './tags.js'
import { marked } from 'marked'


export function render(lines, opts={}) {
  const { data={}, lib=[], highlight } = opts

  // syntax highlighter
  marked.setOptions({ highlight })

  const page = parsePage(lines)

  const html = page.sections.map(el => {
    const { name, md, attr } = el
    const comp = name && lib.find(el => el.name == name)
    const alldata = { ...data, ...el.data, attr }
    const tag = tags[name]

    // tag
    return tag ? tag(alldata, opts) :

      // server component
      comp ? comp.render(alldata, opts) :

      // markdown
      md ? renderMD(md, mergeLinks(page.links, data.links)) :

      // island
      name ? renderIsland(el) :

      // section
      tags.section(alldata, opts)

  }).join('\n')

  return { ...page, html }
}


export function renderIsland({ name, attr, data }) {
  const json = !Object.keys(data)[0] ? '' : elem('script',
    { type: 'application/json' }, JSON.stringify(data)
  )
  return elem('nue-island', { ...attr, island: name }, json)
}

/*
  Marked does not support editing of the AST abstract syntax tree regarding links
  So we have no use of the already tokenized tree and have to re-parse here :(

  https://github.com/markedjs/marked/issues/3135
*/
export function renderMD(md, links) {
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
