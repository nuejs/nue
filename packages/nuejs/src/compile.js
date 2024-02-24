
import { mkdom, getComponentName, isBoolean, walk, objToString, getPosition, STD } from './fn.js'
import { parseExpr, parseFor, setContext, setContextTo } from './expr.js'
import { promises as fs } from 'node:fs'
import { DomUtils } from 'htmlparser2'
import { dirname } from 'node:path'
const { getOuterHTML, getInnerHTML, removeElement } = DomUtils

function compileNode(root) {
  const expr = []

  // push expression
  function push(fn, is_handler) {
    const len = expr.length
    expr.push({ fn, is_handler })
    return '' + len
  }

  walk(root, function(node) {
    const { attribs={}, tagName } = node
    const content = node.data

    if (node.type == 'comment' || attribs.server || tagName == 'noscript') removeElement(node)

    // attributes
    for (let key in attribs) {
      const val = attribs[key]
      const has_expr = val.includes('{')

      // class="{}" --> :class="{}"
      if (key[0] != ':' && has_expr) {
        delete attribs[key]
        key = ':' + key
      }

      // after above clause
      const char = key[0]

      // :disabled -> $disabled
      if (char == ':' && isBoolean(key.slice(1))) {
        delete attribs[key]
        key = '$' + key.slice(1)
        attribs[key] = val
      }

      // event handler
      if (char == '@') {
        const { name, body } = getEventHandler(key, val)

        if (body) {
          delete attribs[key]
          attribs[name] = push(body, true)
        }

      // for expression
      } else if (key == ':for') {
        attribs[key] = push(compileLoop(val, node))

      // attributes
      } else if (':$'.includes(char) && val && key != ':is') {
        const expr = has_expr ? arrwrap(parseExpr(val)) : setContext(val)
        attribs[key] = push(expr)
      }
    }

    // The { content } --> :1:
    const _attr = node.parentNode?.attribs || {}

    if (!_attr[':pre'] && content?.includes('{')) {
      const html = getHTML(content)
      const i = push(html ? setContext(html) : arrwrap(parseExpr(content)))
      if (html) _attr[':html'] = '' + i
      node.data = html ? '' : `:${i}:`
    }
  })

  const fns = expr.map(el => {
    return el.is_handler ? `(_,e) => { ${el.fn} }` : `_ => ${el.fn}`
  })

  return { tmpl: getOuterHTML(root).replace(/\s{2,}/g, ' '), fns }
}

const quote = str => `'${str}'`

function arrwrap(str) {
  return '[' + str + ']'
}

function getHTML(str) {
  str = str.trim()
  if (str.startsWith('{{') && str.endsWith('}}')) {
    return str.slice(2, -2)
  }
}

export function compileLoop(str, node) {
  const [key, expr, index, is_object] = parseFor(str)

  // syntax error
  if (!expr) throw {
    title: 'Transpile error',
    text: `Syntax error in :for expression`,
    expr: str,
  }

  const keys = Array.isArray(key) ? '[' + key.map(quote) + ']' : quote(key)
  return '[' + [keys, expr, quote(index)].join(', ') + (is_object ? ', true' : '') + ']'
}


// event handlers
const MODIFIERS = {
  stop: 'e.stopPropagation()',
  prevent: 'e.preventDefault()',
  self: 'if (e.target != this) return',
}

const KEY_ALIAS = {
  enter: ['return'],
  delete: ['backspace'],
  esc: ['escape'],
  space: [' ', 'spacebar', 'space bar'],
  up: ['arrowup'],
  down: ['arrowdown'],
  left: ['arrowleft'],
  right: ['arrowright'],
}

function getModifiers(name, mods) {
  let keycode = ''

  const ret = mods.map((key) => {
    const mod = MODIFIERS[key]
    if (!mod && key != 'once') keycode = key
    return mod

  }).filter(el => !!el)

  if (name.startsWith('@key') && keycode) {
    const code = keycode.replace('-', '')
    const codes = [`'${code}'`]
    const alias = KEY_ALIAS[code]
    if (alias) alias.forEach(code => codes.push(`'${code}'`))
    ret.unshift(`if (![${codes.join(',')}].includes(e.key.toLowerCase())) return`)
  }

  return ret
}

// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
export function getEventHandler(key, val) {
  const [name, ...mods] = key.split('.')
  const is_expr = /\W/.exec(val)

  const handler = is_expr ? setContextTo(val) : `_.${val}.call(_, e)`
  const els = getModifiers(name, mods)

  els.push(handler)
  if (mods.includes('once')) els.push(`e.target.on${name.slice(1)} = null`)
  return { name, body: els[1] ? '{' + els.join(';') + '}' : els[0] }
}

/*
function toKebabCase(str) {
  return str.replace(/([A-Z])/, (m, _, i) => '-' + m.toLowerCase())
}
*/

function getJS(nodes) {
  const scripts = nodes.filter(el => el.type == 'script')
  const js = scripts.map(getInnerHTML)
  scripts.forEach(removeElement)
  return js.join('\n')
}


function createComponent(node) {
  const name = getComponentName(node)

  if (STD.includes(name)) {
    throw `Invalid tag name: "${name}". Cannot use standard HTML5 tag names.`
  }

  const js = getJS(node.children)

  // must be after getJS()
  const { tmpl, fns } = compileNode(node)

  return objToString({
    name,
    tagName: node.tagName,
    tmpl: tmpl.replace(/\n/g, ''),
    Impl: js && `class { ${js} }`,
    fns: fns[0] && `[\n    ${fns.join(',\n    ')}\n  ]`
  })
}


export function parse(src) {
  const { children } = mkdom(src)

  try {
    const components = children.filter(el => el.type == 'tag').map(el => createComponent(el))
    const js = getJS(children)
    return { js, components }

  } catch (e) {
    if (e.expr) Object.assign(e, getPosition(src, e))
    throw e
  }

}

export function compile(src) {
  const { js, components } = parse(src)
  return [ js,
    'export const lib = [', components.join(',') + ']',
    'export default lib[0]'

  ].join('\n')
}

// optional dest
export async function compileFile(path, dest) {
  const template = await fs.readFile(path, 'utf-8')
  const js = compile(template)
  if (dest) {
    const destDir = dirname(dest)
    await fs.mkdir(destDir, { recursive: true })
    await fs.writeFile(dest, js)
  }
  return js
}
