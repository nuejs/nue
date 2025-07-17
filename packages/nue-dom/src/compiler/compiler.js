
/* Compiles AST to JavaScript */
import { inspect } from 'node:util'
import { parsePage } from './page.js'

export function compileTemplate(template) {
  const { script, tags } = parsePage(template)
  const js = []

  if (script) js.push(script)

  const lib = compileJS(inspect(tags, { compact: true, depth: Infinity }))
  js.push(`export const lib = ${ lib }`)

  return js.join('\n')
}

const RE_FN = /(script|h_fn|fn):\s*(['"`])([^\2]*?)\2/g

export function compileJS(js) {
  return js.replace(RE_FN, function(_, key, __, expr) {
    return key == 'script' ? `${key}: function() { ${expr.trim().replaceAll('\\n', '\n')} \n\t\t}`
      : `${key}: ${compileFn(expr, key[0] == 'h')}`
  })
}

// compiler.test.js: _.foo + 1 --> _=>(_.foo + 1)
export function compileFn(str, is_event) {
  str = str.trim()

  const word = str.startsWith('_.') ? str.slice(2) : str

  const is_simple = !/\W/.test(word)

  if (is_event) {
    return '(_,$e)=>' + (is_simple ? `${str}($e)`
      : str.includes(';') ? `{${str}}`
      : str
    )
  }
  return '_=>' + (is_simple ? str : `(${str})`)
}


