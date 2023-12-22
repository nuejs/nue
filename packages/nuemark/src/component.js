

const ATTR = 'id is class style'.split(' ')

/*
  --> { name, attr, data }
*/
export function parseComponent(input) {
  const { str, getValue } = valueGetter(input)
  let [name, ...attribs] = str.split(/\s+/)
  const self = { attr: {}, data: {} }

  // #id or .class
  const i = name.search(/[\#\.]/)

  if (!i) {
    attribs.unshift(name)
    name = undefined

  // <name>.class
  } else if (i > 0) {
    attribs.unshift(name.slice(i))
    name = name.slice(0, i)
  }


  for (const el of attribs) {
    const [key, val] = el.split('=')

    // data: key="value"
    if (val) {
      const ctx = ATTR.includes(key) || key.startsWith('data-') ? 'attr' : 'data'
      self[ctx][key] = 1 * val || getValue(val) || val

    // key only
    } else {

      // #id.foo.bar
      if ('.#'.includes(key[0])) {
        Object.assign(self.attr, parseAttr(key))

      } else  {
        if (self.data._) self.data[key] = true
        else self.data._ = getValue(key) || key
      }
    }
  }

  return { ...self, name }
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

// .foo#bar.baz -> class: ['foo', 'bar'], id: 'bar'
export function parseAttr(str) {
  const classes = []
  const ret = {}

  str.replace(/\.([\w\-]+)/g, (_, el) => classes.push(el))
  str.replace(/#([\w\-]+)/, (_, el) => ret.id = el)
  if (classes[0]) ret.class = classes.join(' ')

  return Object.keys(ret)[0] && ret
}



