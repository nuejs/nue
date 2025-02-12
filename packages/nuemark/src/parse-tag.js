
const ATTR = 'id is class style hidden disabled popovertarget popover'.split(' ')

/*
  --> { name, attr, data }
*/
export function parseTag(input) {
  const { str, getValue } = valueGetter(input)
  const strings = str.split(/\s+/)
  const specs = strings.filter((s, i) => !i || s.match(/^[#|.]/)).join('')
  const attribs = strings.filter(s => !specs.includes(s))
  const self = { ...parseSpecs(specs), data: {} }
  const classes = new Set((self.attr?.class || '').split(' '))

  function set(key, val) {
    if (key == 'class') return val.split(' ').forEach(v => classes.add(v))

    const ctx = ATTR.includes(key) || key.startsWith('data-') ? 'attr' : 'data'
    self[ctx][key] = val
  }

  for (const el of attribs) {
    const [key, val] = el.split('=')

    // data: key="value"
    if (val) set(key, parseValue((getValue(val) || val)))

    // key only
    else if (!/\W/.test(key)) set(key, true)

    // default key
    else set('_', getValue(key) || key)
  }

  if (classes.size) self.attr.class = [...classes].join(' ')

  return self
}



function parseValue(val) {
  return val == "false" ? false : val == "true" ? true : val == "0" ? 0 : (1 * val || val)
}

/*
  foo="bar" baz="hey dude" -->
    { str: foo=:1: bar=:2: }
    getValue(':1:') => 'bar'
*/
const RE = { single_quote: /'([^']+)'/g, double_quote: /"([^"]+)"/g }

export function valueGetter(input) {
  const strings = []
  const push = (_, el) => `:${strings.push(el)}:`
  const str = input.replace(RE.single_quote, push).replace(RE.double_quote, push)

  function getValue(key) {
    if (key[0] == ':' && key.slice(-1) == ':') {
      return strings[1 * key.slice(1, -1) - 1]
    }
  }

  return { str, getValue }
}

// tabs.foo#bar.baz -> { name: 'tabs', class: ['foo', 'bar'], id: 'bar' }
export function parseSpecs(str) {
  const self = { name: str, attr: {} }
  const i = str.search(/[\#\.]/)

  if (i >= 0) {
    self.name = str.slice(0, i) || null
    self.attr = parseAttr(str.slice(i))
  }
  return self
}

export function parseAttr(str) {
  const attr = {}

  // classes
  const classes = new Set()
  str.replace(/\.([\w\-]+)/g, (_, el) => classes.add(el))
  if (classes.size) attr.class = [...classes].join(' ')

  // id
  str.replace(/#([\w\-]+)/, (_, el) => attr.id = el)

  return attr
}



