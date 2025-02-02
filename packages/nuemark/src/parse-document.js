
import { renderBlocks, createHeadingId } from './render-blocks.js'
import { parseLinkTitle } from './parse-inline.js'
import { renderInline } from './render-inline.js'
import { parseBlocks } from './parse-blocks.js'
import { load as parseYAML } from 'js-yaml'
import { elem } from './render-blocks.js'


// OPTS: { data, sections, content_wrapper, heading_ids, links, tags }
export function parseDocument(lines) {
  const meta = stripMeta(lines)
  const things = parseBlocks(lines)
  const { blocks } = things

  // title
  if (!meta.title) {
    const tag = blocks.find(el => el.is_tag)
    meta.title = getTitle(blocks) || tag && getTitle(tag.blocks) || ''
  }

  // descrption
  if (!meta.description) {
    const block = blocks.find(el => el.is_content)
    meta.description = block?.content[0]
  }

  const sections = sectionize(blocks) || [blocks]

  function renderSections(opts) {
    const classList = Array.isArray(opts.sections) ? opts.sections : []
    const wrap = opts.content_wrapper
    const html = []

    sections.forEach((section, i) => {
      const content = renderBlocks(section, opts)
      html.push(elem('section', { class: classList[i] }, wrap ? elem('div', { class: wrap }, content) : content))
    })
    return html.join('\n\n')
  }

  return {
    render(opts = {}) {
      Object.assign(things.reflinks, parseReflinks(opts.links))
      opts = { ...opts, ...things }
      const html = opts.sections ? renderSections(opts) : renderBlocks(blocks, opts)
      return html + renderFootnotes(things.footnotes)
    },

    renderTOC(attr = {}) {
      const navs = sections.map(renderNav).join('\n').trim()
      return elem('div', { class: attr.class }, navs)
    },

    get headings() {
      return blocks.filter(b => !!b.level).map(h => {
        const id = h.attr.id || createHeadingId(h.text)
        return { id, ...h }
      })
    },

    codeblocks: blocks.filter(el => el.is_code),
    meta,
  }
}

export function sectionize(blocks = []) {
  const arr = []
  let section

  // first (sub)heading
  const hr = blocks.find(el => el.is_separator)
  const h = blocks.find(el => el.level > 1)

  // no heading nor separator -> no sections
  if (!h && !hr) return

  blocks.forEach((el, i) => {
    const is_separator = hr ? el.is_separator : el.level <= h?.level

    // add new section
    if (!section || is_separator) arr.push(section = [])

    // add content to section
    if (!el.is_separator) section?.push(el)
  })

  return arr[0] && arr
}


function renderFootnotes(arr) {
  if (!arr.length) return ''
  const html = arr.map(el => elem('li', elem('a', { name: el.key }) + renderInline(el.value)))
  return elem('ol', { role: 'doc-endnotes' }, html.join('\n'))
}


function renderNav(blocks) {
  const headings = blocks.filter(b => [2, 3].includes(b.level))

  const links = headings.map(h => {
    const id = h.attr.id || createHeadingId(h.text)
    const label = h.level == 2 ? elem('strong', h.text) : h.text
    return elem('a', { href: `#${id}` }, label)
  })

  return links[0] ? elem('nav', links.join('\n')) : ''
}

function getTitle(blocks) {
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

function parseReflinks(links = {}) {
  for (const key in links) {
    const href = links[key]
    if (typeof href == 'string') links[key] = parseLinkTitle(href)
  }
  return links
}



