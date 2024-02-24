
const VARIABLE = /(^|[\-\+\*\/\!\s\(\[]+)([\$a-z_]\w*)\b/g
const STRING = /('[^']+'|"[^"]+")/
const EXPR = /\{([^{}]+)\}/g


// https://github.com/vuejs/core/blob/main/packages/shared/src/globalsWhitelist.ts
const RESERVED = `
  alert arguments Array as BigInt Boolean confirm console delete Date decodeURI decodeURIComponent
  document else encodeURI encodeURIComponent false get history if in Infinity instanceof
  Intl isFinite isNaN JSON localStorage location Map Math NaN navigator new null Number
  number Object of parseFloat parseInt prompt RegExp sessionStorage Set String this
  throw top true typeof undefined window $event`.trim().split(/\s+/)


// foo -> _.foo
export function setContextTo(expr) {
  return expr?.replace(VARIABLE, function(match, prefix, varname, i) {
    const is_reserved = RESERVED.includes(varname)
    return prefix + (is_reserved ? varname == '$event' ? 'e' : varname : '_.' + varname.trimStart())
  })
}

// 'the foo' + foo -> 'the foo' + _.foo
export function setContext(expr) {
  return ('' + expr).split(STRING).map((el, i) => i % 2 == 0 ? setContextTo(el) : el).join('')
}


// style="color: blue; font-size: { size }px"
export function parseExpr(str, is_style) {
  const ret = []

  str.split(EXPR).map((str, i) => {

    // normal string
    if (i % 2 == 0) {
      if (str) {
        str = str.replace(/\s+/g, ' ')
        ret.push(str.includes("'") ? JSON.stringify(str) : `'${str}'`)
      }

    // Object: { is-active: isActive() }
    } else if (isObject(str.trim())) {
      const vals = parseClass(str)
      ret.push(...vals)

    } else {
      ret.push(setContext(str.trim()))
    }

  })

  return ret
}

function isObject(str) {
  const i = str.indexOf(':')
  return i > 0 && !str.includes('?') && /^[\w-]+$/.test(str.slice(0, i))
}

/*
  is-active: isActive, danger: hasError
  --> [_.isActive && 'is-active', _.hasError && 'danger']
*/
export function parseClass(str) {
  return str.split(',').map(el => {
    const [name, expr] = el.trim().split(':').map(el => el.trim())
    return setContextTo(expr) + ' && ' + (name[0] == "'" ? name : `'${name} '`)
  })
}

/* { color: 'blue',  }
export function parseStyle(str) {
  return str.split(',').map(el => {
    const [name, expr] = el.trim().split(':').map(el => el.trim())
    const exp = setContextTo(expr)
    return  exp + ' && ' + `'${name}: ' + (${exp})`
  })
}
*/


function parseObjectKeys(str) {
  const i = str.indexOf('}') + 1
  if (!i) throw `Parse error: ${str}`
  const keys = parseKeys(str.slice(0, i))
  const j = str.slice(i).indexOf(',')
  const index = j >= 0 ? str.slice(i + j + 1).trim() : undefined
  return { keys, index }
}

function parseKeys(str) {
  return str.trim().slice(1, -1).split(',').map(el => el.trim())
}

export function parseFor(str) {
  let [prefix, _, expr ] = str.trim().split(/\s+(in|of)\s+/)
  prefix = prefix.replace('(', '').replace(')', '').trim()
  expr = setContextTo(expr)

  // Object.entries()
  if (prefix[0] == '[') {
    const keys = parseKeys(prefix)
    return [ keys.slice(0, 2), expr, keys[2] || '$index', true ]

  // Object deconstruction
  } else if (prefix[0] == '{') {
    const { keys, index } = parseObjectKeys(prefix)
    return [ keys, expr, index || '$index' ]

  // Normal loop variable
  } else {
    const [ key, index='$index' ] = prefix.split(/\s?,\s?/)
    return [ key, expr, index ]
  }
}




