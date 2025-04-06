import { glow } from 'nue-glow'

import { renderInline, renderTokens } from './render-inline.js'
import { renderTable, renderTag, wrap } from './render-tag.js'
import { parseBlocks } from './parse-blocks.js'


// for testing only
export function renderLines(lines, opts) {
  const things = parseBlocks(lines)
  return renderBlocks(things.blocks, { ...opts, ...things })
}

export function renderBlocks(blocks, opts = {}) {
  return blocks.map(b => renderBlock(b, opts)).join('\n')
}

function renderBlock(block, opts) {
  const fn = opts?.beforerender
  if (fn) fn(block)

  return block.is_content ? renderContent(block.content, opts) :
    block.is_heading ? renderHeading(block, opts) :
      block.is_quote ? elem('blockquote', renderBlocks(block.blocks, opts)) :
        block.is_tag ? renderTag(block, opts) :
          block.is_table ? renderTable(block, opts) :
            block.is_list ? renderList(block, opts) :
              block.is_code ? renderCode(block, opts) :
                block.is_newline ? '' :
                  block.is_break ? '<hr>' :
                    console.error('Unknown block', block)
}

// recursive
function renderList({ items, numbered }, opts) {
  const html = items.map(blocks => elem('li', renderBlocks(blocks, opts)))
  return elem(numbered ? 'ol' : 'ul', html.join('\n'))
}

export function renderHeading(h, opts = {}) {
  const attr = { ...h.attr }
  const show_id = opts.heading_ids
  if (show_id && !attr.id) attr.id = createHeadingId(h.text)

  // anchor
  const a = show_id ? elem('a', { href: `#${attr.id}`, title: h.text }) : ''

  return elem('h' + h.level, attr, a + renderTokens(h.tokens, opts))
}


export function createHeadingId(text) {
  let hash = text.slice(0, 32).replace(/'/g, '').replace(/[\W_]/g, '-').replace(/-+/g, '-').toLowerCase()
  if (hash[0] == '-') hash = hash.slice(1)
  if (hash.endsWith('-')) hash = hash.slice(0, -1)
  return hash
}

export function renderContent(lines, opts) {
  const html = lines.map(line => renderInline(line, opts)).join(' ')
  return elem('p', html)
}

function renderCode({ name, code, attr, data }, opts) {
  const { numbered } = data
  const klass = attr.class
  delete attr.class

  // Create a wrapper with the copy button and the code block
  let codeHtml = glow(code, { language: name, numbered })

  // Add a copy button with appropriate styles and functionality
  const copyButton = `<button class="code-copy-btn" onclick="copyCode(this)" title="Copy code" aria-label="Copy code to clipboard">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  </button>`;

  // Set data attributes for language and numbered properties
  const dataAttrs = name ? ` data-language="${name}"` : '';
  const numberedAttr = numbered ? ' data-numbered="true"' : '';
  const uniqueId = `code-block-${Math.random().toString(36).substring(2, 10)}`;

  // Calculate proper padding based on code content (safely handle code if it's not a string)
  let additionalPadding = 'padding-right: 45px;';
  if (typeof code === 'string') {
    const codeLines = code.split('\n');
    const maxLineLength = Math.max(...codeLines.map(line => line.length));
    additionalPadding = numbered ? 'padding-right: 60px;' : (maxLineLength < 30 ? 'padding-right: 40px;' : 'padding-right: 45px;');
  } else {
    // Fallback if code is not a string
    additionalPadding = numbered ? 'padding-right: 60px;' : 'padding-right: 45px;';
  }

  // Set button position based on code content
  const buttonPosition = numbered ? 'right: 2.5em;' : 'right: 0.5em;';
  const buttonTop = (name === 'bash' || name === 'sh' || name === 'shell') ? 'top: 0.8em;' : 'top: 0.5em;';

  // Inline style ensures correct positioning without requiring JavaScript positioning
  const inlineStyles = `
    <style>
      #${uniqueId} pre {
        ${additionalPadding}
      }
      #${uniqueId} .code-copy-btn {
        ${buttonPosition}
        ${buttonTop}
      }
    </style>
  `;

  // Add copy button and inline styles for immediate correct positioning
  let html = `<div id="${uniqueId}" class="code-block-wrapper"${dataAttrs}${numberedAttr}>
    ${inlineStyles}
    ${copyButton}
    <pre ${renderAttrs(attr)}>${codeHtml}</pre>
  </div>`;

  const caption = data.caption || data._;

  if (caption) {
    const figcaption = elem('figcaption', renderInline(caption));
    return elem('figure', { class: klass }, figcaption + html);
  }

  return wrap(klass, html);
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
    if (val) arr.push(val === true ? key : `${key}="${val}"`)
  }
  return arr[0] ? ' ' + arr.join(' ') : ''
}





