
import { inspect } from 'node:util'

import { parse } from './ast.js'
import { tokenize } from './tokenizer.js'


export function parseTemplate(template) {
  const tokens = tokenize(template)
  return parse(tokens)
}

export function compileTemplate(template) {
  const all = parseTemplate(template)
  const scripts = all.filter(el => el.tag == 'script' && !el.attr)
  const lib = all.filter(el => el.tag != 'script')
  const js = []

  scripts.forEach(script => js.push(script.children[0].text.trim()))

  const lib_str = inspect(lib, { compact: true, depth: Infinity })
  js.push(`export const lib = ${ convertFns(lib_str) }`)

  return js.join('\n')
}



const RE_FN = /(script|h_fn|fn):\s*(['"`])([^\2]*?)\2/g

export function convertFns(js) {
  return js.replace(RE_FN, function(_, key, __, expr) {
    return key == 'script' ? `${key}: function() { ${expr.trim().replaceAll('\\n', '\n')} \n\t\t}`
      : `${key}: ${convertFn(expr, key[0] == 'h')}`
  })
}

export function convertFn(str, is_event) {
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



/* not currently in use

  const names = parseImports(imports)
  if (names.length) js.push(`const imports = { ${names.join(',')} }`)

export function parseImports(script) {
  const arr = []
  const matches = script.matchAll(/import\s*{([^}]+)}\s*from\s*['"][^'"]+['"]/g)
  for (const match of matches) {
    arr.push(...match[1].split(',').map(name => name.trim().split(' as ')[0]))
  }
  return arr
}
*/