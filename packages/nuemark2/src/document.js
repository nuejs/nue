
import { renderBlocks, createHeadingId } from './render-blocks.js'
import { parseLinkTitle } from './parse-inline.js'
import { parseBlocks } from './parse-blocks.js'
import { load as parseYAML } from 'js-yaml'

export function parseDocument(lines) {
  const user_meta = stripMeta(lines)
  const blocks = parseBlocks(lines)
  const { reflinks } = blocks

  const meta = {

    get title() {
      const tag = blocks.find(el => el.is_tag)
      return findTitle(blocks) || tag && findTitle(tag.blocks) || ''
    },

    get description() {
      const block = blocks.find(el => el.is_content)
      return block?.content[0]
    },

    ...user_meta
  }

  const api = {

    get sections() {
      return sectionize(blocks) || [ blocks ]
    },

    get codeblocks() {
      return blocks.filter(el => el.is_code)
    },

    addReflink(label, href) {
      reflinks.push({ label, ...parseLinkTitle(href) })
    },

    renderSections(classes, opts) {
      const html = []

      api.sections.forEach((blocks, i) => {
        html.push(elem('section', { class: classes[i] }, renderBlocks(blocks, opts)))
      })
      return html.join('\n\n')
    },

    renderTOC(attr={}) {
      const navs = api.sections.map(renderNav).join('\n').trim()
      return elem('div', { 'aria-label': 'Table of contents', ...attr }, navs)
    },

    render(opts={ data: meta }) {
      let classes = opts.data.sections
      if (classes && !Array.isArray(classes)) classes = []
      return classes ? api.renderSections(classes, opts) : renderBlocks(blocks, opts)
    },
  }

  return { meta, reflinks, ...api }
}


export function sectionize(blocks=[]) {
  const arr = []
  let section

  // first (sub)heading
  const heading = blocks.find(el => el.level > 1)

  // no heading nor separator -> no sections
  if (!heading && !blocks.find(el => el.is_separator)) return

  blocks.forEach((el, i) => {
    const sep = el.is_separator

    // add new section
    if (!section || el.level <= heading?.level || sep) {
      const prev = blocks[i-1]

      // heading followed by separator --> skip
      if (!(el.level && prev?.is_separator)) {
        arr.push(section = [])
      }
    }

    // add content to section
    if (!sep) section.push(el)

  })
  return arr[0] && arr
}


function renderNav(blocks) {
  const headings = blocks.filter(b => [2, 3].includes(b.level))

  const links = headings.map(h => {
    const id = h.attr.id ||createHeadingId(h.text)
    const label = h.level == 2 ? elem('strong', h.text) : h.text
    return elem('a', { href: `#${ id }` }, label)
  })

  return links[0] ? elem('nav', links.join('\n')) : ''
}

function findTitle(blocks) {
  const h1 = blocks?.find(el => el.level == 1)
  return h1?.text || ''
}

// extracts meta from the head, lines array gets spliced/mutated
export function stripMeta(lines) {
  let start = 0, end = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const is_front = line == '---'
    if (!start) {
      if (is_front) start = i + 1
      else if (line.trim()) return {}
    }
    else if (is_front) { end = i; break }
  }

  if (!start) return {}

  const front = lines.slice(start, end).join('\n')
  lines.splice(0, end + 1)
  return parseYAML(front)
}


/**** utilities ****/
const SELF_CLOSING = ['img', 'source', 'meta', 'link']

export function elem(name, attr, body) {
  if (typeof attr == 'string') { body = attr; attr = null }

  const html = [`<${name}${renderAttrs(attr)}>`]

  if (body) html.push(body)
  if (!SELF_CLOSING.includes(name)) html.push(`</${name}>`)
  return html.join('')
}


function renderAttrs(attr) {
  const arr = []
  for (const key in attr) {
    const val = attr[key]
    if (val) arr.push(val === true ? key :`${key}="${val}"`)
  }
  return arr[0] ? ' ' + arr.join(' ') : ''
}


