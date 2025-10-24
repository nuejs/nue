
import { HTML5_TAGS, SVG_TAGS } from './html5.js'
import { parseAttributes } from './attributes.js'
import { addContext } from './context.js'


// former tag.js / parseTag
export function createAST(block, imports) {
  const { tag, children, text, meta } = block
  if (text) return parseText(text, imports)

  const { tagName, attr } = parseOpeningTag(tag)
  if (tagName == 'slot') return { slot: true }

  const specs = attr ? parseAttributes(attr, imports) : {}
  const comp = { tag: tagName.trim(), ...specs }

  if (meta) comp.meta = meta

  const i = SVG_TAGS.findIndex(el => el.toLowerCase() == tagName.toLowerCase())

  if (i >= 0) {
    comp.svg = true

    const correct = SVG_TAGS[i]
    if (correct != tagName) {
      comp.tag = correct
      console.warn(`Fixed SVG case: ${tagName} -> ${correct}`)
    }

  } else if (tagName.includes('-') || !HTML5_TAGS.includes(tagName)) {
    comp.is_custom = true
  }

  const mount = comp.attr?.find(a => a.name == 'mount')
  if (mount) {
    comp.attr.splice(comp.attr.indexOf(mount), 1)
    comp.is_custom = true
    comp.mount = mount
  }

  if (children.length) {
    const ret = parseChildren(children, imports)
    if (ret.script) comp.script = convertGetters(convertFunctions(ret.script))
    if (ret.children.length) comp.children = ret.children
  }
  return comp
}

function parseOpeningTag(tag) {
  tag = tag.replace('/>', '>')
  const i = tag.indexOf(' ')
  if (i == -1) return { tagName: tag.slice(1, -1) }
  return { tagName: tag.slice(1, i), attr: tag.slice(i + 1, -1).trim() }
}

function parseChildren(arr, imports) {
  const scriptEl = arr.find(el => el.tag == '<script>')
  const children = arr.filter(el => el != scriptEl).map(el => createAST(el, imports))
  const script = scriptEl ? scriptEl.children[0]?.text.trim() : ''
  return { children: mergeConditionals(children), script }
}


function mergeConditionals(arr) {
  return arr.reduce((result, current) => {
    const is_if = current.if || current['else-if'] || current.else
    const last = result[result.length - 1]

    if (is_if) {
      if (current.if) result.push({ some: [current] })
      else if (last?.some) last.some.push(current)
      else result.push({ some: [current] })
    } else {
      result.push(current)
    }

    return result
  }, [])
}


function parseText(text, imports) {
  if (text[0] == '{' && text.endsWith('}')) {
    const is_html = text[1] == '{'
    const am = is_html ? 2 : 1
    const expr = { fn: addContext(text.slice(am, -am), imports).trim() }
    if (is_html) expr.html = is_html
    return expr
  }
  return { text }
}




// foo() {} --> this.foo = function() { }
export function convertFunctions(script) {
  return script.replace(
    /^(\s*)(async\s+)?(\w+)\s*\(([^)]*)\)\s*{/gm, (_, indent, asy, name, args) => {
      if (_.includes('function') || ['for', 'while', 'if', 'switch'].includes(name)) return _
      return `${indent}this.${name} = ${asy ? 'async ' : ''}function(${args.trim()}) {`
    }
  )
}

export function convertGetters(script) {
  return script
    // Handle multiline getters first
    .replace(
      /^(\s*)get (\w+)\(\)\s*\{([\s\S]*?)\n\1\}/gm,
      (_, indent, name, body) => {
        return `${indent}Object.defineProperty(this, '${name}', { get() {${body}} })`
      }
    )
    // Then handle single-line getters
    .replace(
      /^(\s*)get (\w+)\(\)\s*\{([^}]*)\}/gm,
      (_, indent, name, body) => {
        return `${indent}Object.defineProperty(this, '${name}', { get() {${body}} })`
      }
    )
}