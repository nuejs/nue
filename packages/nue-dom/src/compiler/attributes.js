
import { BOOLEAN, EVENTS, STRICT_ATTRS } from './html5.js'
import { addContext } from './context.js'


export function tokenizeAttr(attrStr) {
  return (attrStr.match(/[^\s=]+(?:=(?:"[^"]*"|\${[^}]+}|[^\s]+))?/g) || []).map(token =>
    token.replace(/^([^=]+)="([^"]*)"$/, '$1=$2')
  )
}

export function parseAttributes(attrs, imports) {
  const tokens = tokenizeAttr(attrs)
  const result = {}

  function push(key, val) {
    const arr = result[key] = result[key] || []
    arr.push(val)
  }

  for (const token of tokens) {
    let { name, value } = parseNameVal(token)
    const is_colon = name[0] == ':'
    const base = is_colon ? name.slice(1) : name

    if (name == ':each') {
      result.for = parseFor(value, imports)

    } else if (name == ':is') {
      result.is = value

    } else if (name == 'style') {
      // ignore

    } else if ([':if', ':else-if', ':else'].includes(name)) {
      result[base] = base == 'else' ? true : addContext(value, imports)

    // event handler
    } else if (name.slice(0, 3) == ':on' && EVENTS.includes(name.slice(3))) {
      if (!value) value = name.slice(1)
      if (!/\W/.test(value)) value += '($e)'
      push('handlers', { name: base, h_fn: addContext(value, imports) })

    } else {
      const attr = { name: base }

      // :href --> :href="href"
      if (is_colon && !value) value = base
      const fn = is_colon && !value.includes('{') ? addContext(value, imports) : parseExpression(value, name, imports)

      if (fn) attr.fn = fn
      else attr.val = value

      if (name.startsWith('--')) {
        attr.name = name.slice(2)
        attr.is_var = true

      } else if (BOOLEAN.includes(base)) {
        attr.bool = true
        if (!fn && !value) attr.val = true

      } else if (is_colon) {
        attr.is_data = true

      } else {
        const correct = STRICT_ATTRS.find(el => el.toLowerCase() == name.toLowerCase())

        if (correct && name != correct) {
          attr.name = correct
          console.warn(`Fixed SVG case: ${name} -> ${correct}`)
        }
      }

      push('attr', attr)
    }
  }
  return result
}

function parseNameVal(attr) {
  const i = attr.indexOf('=')
  if (i == -1) return { name: attr, value: '' }

  const name = attr.slice(0, i)
  const value = attr.slice(i + 1)
  return { name, value }
}

export function parseFor(str, imports) {
  const [args, _, expr] = str.split(/\s+(in|of)\s+/)
  const for_args = parseForArgs(args.trim())
  const fn = addContext(expr, imports)
  return { fn, ...for_args }
}

export function _parseForArgs(args) {
  const hasIndex = /[}\]],/.exec(args) || (!'[{'.includes(args[0]) && args.includes(','))
  const keys = args.replace(/[(){}[\]]/g, '').split(',').map(part => part.trim())
  const is_entries = args.includes('[')
  return hasIndex ? { keys: keys.slice(0, -1), index: keys.pop(), is_entries } : { keys, is_entries }
}


export function parseForArgs(args) {
  // Clean parentheses first, which fixes the failing test
  const cleaned = args.replace(/^\(|\)$/g, '');
  const hasIndex = /[}\]],/.exec(cleaned) || (!'{['.includes(cleaned[0]) && cleaned.includes(','));
  const keys = cleaned.replace(/[(){}[\]]/g, '').split(',').map(part => part.trim());
  const is_entries = cleaned.includes('[');
  return hasIndex ? { keys: keys.slice(0, -1), index: keys.pop(), is_entries } : { keys, is_entries };
}

export function parseExpression(str, attr_name, imports) {
  const parts = str.split(/(\$?{[^}]+})/)
  if (parts.length < 2) return

  return parts.map(part => {
    if (part[0] == '{' && attr_name == 'class') {
      return parseClassHelper(part.slice(1, -1).trim(), imports)

    } else if (part.startsWith('${')) {
      return `(${ addContext(part.slice(2, -1).trim(), imports) })`
    }
    return part ? `"${part}"` : ''

  }).filter(part => part !== '').join(' + ')
}

export function parseClassHelper(val, imports) {
  const pairs = val.split(',').map(pair => pair.trim())

  const obj = pairs.map(pair => {
    let [name, expr] = pair.split(':').map(s => s.trim())
    if (!expr) expr = name
    if (name.includes('-')) name = `"${ name }"`
    return `${ name }: ${ addContext(expr, imports) }`
  })

  return `_.$concat({${obj.join(', ')}})`
}


