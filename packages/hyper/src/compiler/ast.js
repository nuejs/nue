
import { parseAttributes } from './attributes.js'
import { addContext, HTML5_TAGS } from './html5.js'

export function parse(tokens) {
  return parseTags(tokens).map(el => parseTag(el))
}

export function parseTags(tokens) {
  const blocks = []
  let i = 0

  function parseNode() {
    if (i >= tokens.length || !tokens[i].startsWith('<') || tokens[i].startsWith('</')) return

    const tag = tokens[i]
    i++

    // ignore <style> blocks
    if (tag.toLowerCase().startsWith('<style')) return null

    if (tag.endsWith('/>')) return { tag, children: [] }

    const children = []
    while (i < tokens.length && !tokens[i].startsWith('</')) {
      if (tokens[i].startsWith('<') && !tokens[i].startsWith('</')) {
        const child = parseNode()
        if (child) children.push(child)
      } else {
        children.push({ text: tokens[i] })
        i++
      }
    }

    if (i < tokens.length) i++ // Skip closing tag

    return { tag, children }
  }

  while (i < tokens.length) {
    const node = parseNode()
    if (node) blocks.push(node)
    else i++ // Skip non-tag tokens
  }

  return blocks
}

function parseOpeningTag(tag) {
  tag = tag.replace('/>', '>')
  const i = tag.indexOf(' ')
  if (i == -1) return { tagName: tag.slice(1, -1) }
  return { tagName: tag.slice(1, i), attr: tag.slice(i + 1, -1).trim() }
}

export function parseTag(node) {
  const { tag, children, text } = node
  if (text) return parseText(text)

  const { tagName, attr } = parseOpeningTag(tag)
  if (tagName == 'slot') return { slot: true }

  const specs = attr ? parseAttributes(attr) : {}
  const comp = { tag: tagName.trim(), ...specs }
  if (tagName.includes('-') || !HTML5_TAGS.includes(tagName)) comp.is_custom = true

  const mount = comp.attr?.find(a => a.name == 'mount')
  if (mount) {
    comp.attr.splice(comp.attr.indexOf(mount), 1)
    comp.is_custom = true
    comp.mount = mount
  }

  if (children.length) {
    const ret = parseChildren(children)
    if (ret.script) comp.script = convertGetters(convertFunctions(ret.script))
    if (ret.children.length) comp.children = ret.children
  }
  return comp
}

function parseChildren(arr) {
  const scriptEl = arr.find(el => el.tag == '<script>')
  const children = arr.filter(el => el != scriptEl).map(el => parseTag(el))
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


function parseText(text) {
  const c = text[0]
  if ('$#'.includes(c) && text[1] == '{' && text.endsWith('}')) {
    const expr = { fn: addContext(text.slice(2, -1)) }
    if (c == '#') expr.html = true
    return expr
  }
  return { text }
}


// foo() {} --> this.foo = function() { }
function convertFunctions(script) {
  return script.replace(
    /^( *)(async\s+)?(\w+)\s*\(([^)]*)\)\s*{/gm, (_, indent, asy, name, args) => {
      return `${indent}this.${name} = ${asy ? 'async ' : ''}function(${args.trim()}) {`
    }
  )
}

// get foo() {} --> Object.defineProperty
function convertGetters(script) {
  return script.replace(
    /^( *)get (\w+)\(\)\s*{([^}]+)}/gm, (_, indent, name, body) => {
      return `${indent}Object.defineProperty(this, '${name}', { get() {${body}} })`
    }
  )
}

