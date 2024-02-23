
import { parseDocument, DomUtils } from 'htmlparser2'

// shared by render.js and compile.js

export const STD = 'a abbr acronym address applet area article aside audio b base basefont bdi bdo big\
 blockquote body br button canvas caption center circle cite clipPath code col colgroup data datalist\
 dd defs del details dfn dialog dir div dl dt ellipse em embed fieldset figcaption figure font footer\
 foreignObject form frame frameset g head header hgroup h1 h2 h3 h4 h5 h6 hr html i iframe image img\
 input ins kbd keygen label legend li line link main map mark marker mask menu menuitem meta meter\
 nav noframes noscript object ol optgroup option output p param path pattern picture polygon polyline\
 pre progress q rect rp rt ruby s samp script section select small source span strike strong style sub\
 summary sup svg switch symbol table tbody td template text textarea textPath tfoot th thead time\
 title tr track tspan tt u ul use var video wbr'.split(' ')

const SVG = 'animate animateMotion animateTransform circle clipPath defs desc ellipse\
 feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting\
 feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR\
 feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting\
 feSpotLight feTile feTurbulence filter foreignObject g hatch hatchpath image line linearGradient\
 marker mask metadata mpath path pattern polygon polyline radialGradient rect set stop style svg\
 switch symbol text textPath title tspan use view'.split(' ')

STD.push(...SVG)

const BOOLEAN = 'allowfullscreen async autofocus autoplay checked controls default\
 defer disabled formnovalidate hidden ismap itemscope loop multiple muted nomodule\
 novalidate open playsinline readonly required reversed selected truespeed'.split(/\s+/)

export function isBoolean(key) {
  return BOOLEAN.includes(key)
}

export function getComponentName(root) {
  const { attribs } = root
  const name = attribs['@name'] || attribs['data-name'] || attribs.id
  delete attribs['@name']
  return name
}

export function selfClose(str) {
  return str.replace(/\/>/g, function(match, i) {
    const tag = str.slice(str.lastIndexOf('<', i), i)
    const name = /<([\w-]+)/.exec(tag)
    return `></${name[1]}>`
  })
}

export function walk(node, fn) {
  fn(node)
  node = node.firstChild
  let next = null
  while (node) {
    next = node.nextSibling
    walk(node, fn)
    node = next
  }
}

export function objToString(obj, minify) {
  if (!obj) return null

  const prefix = minify ? '' : '  '
  const keys = Object.keys(obj)
  const ret = ['{']

  keys.forEach((key, i) => {
    const comma = i + 1 < keys.length ? ',' : ''
    const val = obj[key]
    if (val) ret.push(`${prefix}${key}: ${quote(val)}${comma}`)
  })

  ret.push('}')
  return ret.join(minify ? '' : '\n')
}

function quote(val) {
  return val.endsWith('}') || val.endsWith(']') || 1 * val ? val : `'${val}'`
}

export function mkdom(src) {
  const dom = parseDocument(selfClose(src))
  walk(dom, (el) => { if (el.type == 'comment') DomUtils.removeElement(el) }) // strip comments
  return dom
}

// render.js only
function isJSObject(val) {
  return val?.constructor === Object || Array.isArray(val) || typeof val == 'function'
}

// exec('`font-size:${_.size + "px"}`;', data)
export function exec(expr, data={}) {
  const fn = new Function('_', 'return ' + expr)
  const val = fn(data)
  return val == null ? '' : isJSObject(val) ? val : '' + val
}


function isStdAttr(name) {
  return ['style', 'class', 'id', 'hidden'].includes(name) || name.startsWith('data-')
}

export function mergeAttribs(to, from) {
  for (const name in from) {
    if (isStdAttr(name)) {
      let val = from[name]
      const toval = to[name]
      if (toval && ['class'].includes(name)) val += ' ' + toval
      to[name] = val
    }
  }
}


// get error position: { line, column }
export function getPosition(template, error) {
  const { expr, subexpr=expr } = error
  const lines = template.split('\n')
  const ret = { line: 1 }

  for (const line of lines) {
    if (line.includes(expr)) {
      ret.lineText = line
      ret.column = line.indexOf(subexpr)
      ret.offset = subexpr.length
      return ret
    }
    ret.line++
  }
  return ret
}

