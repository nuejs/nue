
import { addContext, HTML5_TAGS, SVG_TAGS } from './html5.js'
import { parseAttributes } from './attributes.js'

export function parse(tokens) {
  return parseTags(tokens).map(el => parseTag(el))
}

export function parseTags(tokens) {
  const blocks = []
  const meta = tokens[0]?.meta
  let i = meta ? 1 : 0

  while (i < tokens.length) {
    const result = parseNode(tokens, i)
    if (result.node) blocks.push(result.node)
    i = result.next
  }

  if (meta) blocks[0].meta = meta

  return blocks
}

function parseNode(tokens, i) {
  const tag = tokens[i]

  if (i >= tokens.length || !tag.startsWith('<') || tag.startsWith('</')) {
    return { next: i + 1 }
  }

  i++

  // ignore <style> blocks
  if (tag.toLowerCase().startsWith('<style')) return { next: i }

  if (tag.endsWith('/>')) return { node: { tag, children: [] }, next: i }

  const children = []

  while (i < tokens.length && !tokens[i].startsWith('</')) {
    if (tokens[i].startsWith('<') && !tokens[i].startsWith('</')) {
      const result = parseNode(tokens, i)
      if (result.node) children.push(result.node)
      i = result.next
    } else {
      children.push({ text: tokens[i] })
      i++
    }
  }

  if (i < tokens.length) i++ // Skip closing tag

  return { node: { tag, children }, next: i }
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
  const i = SVG_TAGS.findIndex(el => el.toLowerCase() == tagName.toLowerCase())

  if (i >= 0) {
    comp.svg = true

    const correct = SVG_TAGS[i]
    if (correct != tagName) {
      comp.tag = correct
      console.warn(`Fixed SVG case: ${tagName} -> ${correct}`)
    }

  } else if (tagName.includes('-') || !HTML5_TAGS.includes(tagName)) comp.is_custom = true

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
export function convertFunctions(script) {
  return script.replace(
    /^( *)(async\s+)?(\w+)\s*\(([^)]*)\)\s*{/gm, (_, indent, asy, name, args) => {
      if (_.includes('function') || ['for', 'if'].includes(name)) return _
      return `${indent}this.${name} = ${asy ? 'async ' : ''}function(${args.trim()}) {`
    }
  )
}

// get foo() {} --> Object.defineProperty
export function convertGetters(script) {
  return script.replace(
    /^( *)get (\w+)\(\)\s*{([^}]+)}/gm, (_, indent, name, body) => {
      return `${indent}Object.defineProperty(this, '${name}', { get() {${body}} })`
    }
  )
}

