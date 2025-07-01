
import { JS } from './html5.js'


const CONTEXT_RE = /'[^']*'|"[^"]*"|[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*/g

export function addContext(expr, exceptions = ['state']) {
  const reserved = new Set([...JS, ...exceptions ])

  return expr.replace(CONTEXT_RE, (match, offset, str) => {

    if (match == '$event') return '$e'
    if (match == 'this') return '_'

    // Skip string literals
    if (match[0] == '"' || match[0] == "'") return match

    // Skip property keys
    if (str[offset + match.length] == ':') return match

    // Skip if preceded by . or /
    if (offset > 0 && /[.\/]/.test(str[offset - 1])) return match

    const root = match.split('.')[0]

    return reserved.has(root) ? match : `_.${match}`
  })
}

