

const ATTR = 'id is class style'.split(' ')

/*
  --> { name, attr, data }
*/
export function parseComponent(input) {
  const { str, getValue } = valueGetter(input)
  const [specs, ...attribs] = str.split(/\s+/)
  const self = { ...parseSpecs(specs), data: {} }

  for (const el of attribs) {
    const [key, val] = el.split('=')

    // data: key="value"
    if (val) {
      const ctx = ATTR.includes(key) || key.startsWith('data-') ? 'attr' : 'data'
      self[ctx][key] = 1 * val || getValue(val) || val

    // key only
    } else {
      if (self.data._) self.data[key] = true
      else self.data._ = getValue(key) || key
    }
  }

  return self
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
      return strings[1 * key.slice(1, -1) -1]
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
  const classes = []
  str.replace(/\.([\w\-]+)/g, (_, el) => classes.push(el))
  if (classes[0]) attr.class = classes.join(' ')

  // id
  str.replace(/#([\w\-]+)/, (_, el) => attr.id = el)

  return attr
}



