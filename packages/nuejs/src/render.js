

import { mkdom, getComponentName, mergeAttribs, isBoolean, exec, STD, getPosition, walk } from './fn.js'
import { parseExpr, parseFor, setContext } from './expr.js'
import { parseDocument, DomUtils as DOM } from 'htmlparser2'
import { promises as fs } from 'node:fs'

const { getInnerHTML, getOuterHTML, removeElement } = DOM


function parseError(e) {
  const [msg, sub] = e.toString().split("'")
  const text = msg.slice(0, msg.indexOf(' ('))
  const subexpr = sub.replaceAll('_.', '')
  return { subexpr, text }
}

// name == optional
function renderExpr(str, data, is_class) {
  try {
    const arr = exec('[' + parseExpr(str) + ']', data)
    return arr.filter(el => is_class ? el : el != null).join('')

  } catch (e) {
    throw { title: 'Rendering error', expr: str, ...parseError(e) }
  }
}


function setContent(node, data) {
  // run once
  if (node.__is_set) return

  const str = node.data || ''

  if (str.includes('{')) {
    if (str.startsWith('{{')) {
      if (str.endsWith('}}')) {
        node.data = ''
        const expr = setContext(str.slice(2, -2))
        DOM.appendChild(node.parentNode, parseDocument(exec(expr, data)))
      }

    } else {
      node.data = renderExpr(str, data)
      node.__is_set = true
    }
  }
}

/* attributes must be strings
function toString(val) {
  return 1 * val ? '' + val : typeof val != 'string' ? val.toString() : val
}
*/

function setAttribute(key, attribs, data) {
  let val = attribs[key]
  if (!val) return

  // TODO: check all non-strings here
  if (val.constructor === Object) return

  // attributes must be strings
  if (val === 0 || 1 * val) val = attribs[key] = '' + val

  const has_expr = val.includes('{')

  // strip event handlers
  if (key[0] == '@') return delete attribs[key]

  // foo="{ val }" --> :foo="{ val }"
  if (key[0] != ':' && has_expr) {
    delete attribs[key]
    key = ':' + key
  }

  // expression
  if (key[0] != ':') return

  const name = key.slice(1)
  const value = has_expr ? renderExpr(val, data, name == 'class') : exec(setContext(val), data)

  // boolean attribute
  if (isBoolean(name)) {
    if (value != 'false') attribs[name] = ''
    else delete attribs[name]
    return delete attribs[key]
  }

  // other attribute
  if (value) {
    attribs[name] = typeof value == 'string' ? value.trim() : value
  } else {
    delete attribs[name]
  }

  delete attribs[key]
}

function getIfBlocks(root, expr) {
  const arr = [{ root, expr }]
  while (root = DOM.nextElementSibling(root)) {
    const { attribs } = root
    const expr = getDel(':else-if', attribs) || getDel(':else', attribs) != null
    if (expr) arr.push({ root, expr })
    else break
  }
  return arr
}

function processIf(node, expr, data, deps) {
  const blocks = getIfBlocks(node, expr)

  const active = blocks.find(el => {
    const val = exec(setContext(el.expr), data)
    return val && val != 'false'
  })

  blocks.forEach(el => {
    const { root } = el
    if (el == active) processNode({ root, data, deps })
    else removeNode(root)
  })
  return active
}


// for
function processFor(node, expr, data, deps) {
  const [ $keys, for_expr, $index, is_object_loop ] = parseFor(expr)

  // syntax error
  if (!for_expr) throw {
    title: 'Template error',
    text: `Syntax error in :for expression`,
    expr: expr,
  }

  const items = exec(for_expr, data) || []

  items.forEach((item, i) => {

    // proxy
    const proxy = new Proxy({}, {
      get(_, key) {
        if (is_object_loop) {
          const i = $keys.indexOf(key)
          if (i >= 0) return item[i]
        }

        return key === $keys ? (item == null ? data[key] : item) :
          key == $index ? items.indexOf(item) :
          $keys.includes(key) ? item[key] :
          data[key]
      }
    })

    // clone
    const root = parseDocument(getOuterHTML(node))

    DOM.prepend(node, processNode({ root, data: proxy, deps, inner: node.children }))
  })

  removeNode(node)
}

// child component
function processChild(comp, node, deps, data) {
  const { attribs } = node

  // merge attributes
  const child = comp.create({ ...data, ...attribs }, deps, node.children)
  if (child.children.length == 1) mergeAttribs(child.firstChild.attribs, attribs)

  DOM.replaceElement(node, child)
}

function getDel(key, attribs) {
  const val = attribs[key]
  delete attribs[key]
  return val
}

// mark as removed (removeElement disturbs node traversal on the first run)
function removeNode(node) {
  node.attribs.__remove = 'true'
}


function processNode(opts) {
  const { root, data, deps, inner } = opts

  function walk(node) {
    const { name, type, attribs, nextSibling } = node

    // setup empty attributes (:date --> :date="date")
    for (let key in attribs) {
      if (key[0] == ':' && attribs[key] == '') attribs[key] = key.slice(1)
    }
    // root
    if (type == 'root') {
      walkChildren(node)

    } else if (type == 'script' || attribs?.client) {
      delete attribs.client
      // do nothing: pass content as is

    // content
    } else if (type == 'text') {
      setContent(node, data)

    // element
    } else if (type == 'tag' || type == 'style' || type == 'script') {

      // if
      let expr = getDel(':if', attribs)
      if (expr && !processIf(node, expr, data, deps)) return nextSibling

      // for
      expr = getDel(':for', attribs)
      if (expr) return processFor(node, expr, data, deps)

      // html
      expr = getDel(':html', attribs)
      if (expr) {
        const html = exec(setContext(expr), data)
        DOM.appendChild(node, parseDocument(html))
      }

      walkChildren(node)

      // bind
      expr = getDel(':bind', attribs) || getDel(':attr', attribs)
      if (expr) {
        const attr = expr == '$attrs' ? data : exec(setContext(expr), data)
        Object.assign(attribs, attr)
      }

      // slots
      if (name == 'slot') {
        if (attribs.for) {
          const html = data[attribs.for]
          if (html) DOM.replaceElement(node, mkdom(html))
          else removeNode(node)

        } else if (inner) {
          while (inner[0]) DOM.prepend(node, inner[0])
          removeElement(node)
        }
      }


      // custom component
      const is_custom = !STD.includes(name)
      const component = deps.find(el => el.name == name)

      // client side component
      if (is_custom && !component) {
        setJSONData(node, data)
        node.attribs.island = name
        node.name = 'nue-island'
        return // must return
      }

      // after custom, but before SSR components (for all nodes)
      for (let key in attribs) setAttribute(key, attribs, data)

      // server side component
      if (component) processChild(component, node, deps, data)

    }
  }

  function walkChildren(node) {
    let child = node.firstChild
    while (child) {
      child = walk(child)?.next || child.nextSibling
    }
  }

  walk(root)
  return root
}

function getJS(nodes) {
  const scripts = nodes.filter(el => el.type == 'script' && !Object.keys(el.attribs)[0])
  const js = scripts.map(getInnerHTML)
  scripts.forEach(removeElement)
  return js.join('\n')
}

function createComponent(node, global_js='', template) {
  const name = getComponentName(node)

  // javascript
  const js = getJS(node.children)
  const Impl = js[0] && exec(`class Impl { ${ js } }\n${global_js}`)
  const tmpl = getOuterHTML(node)

  function create(data, deps=[], inner) {
    if (Impl) data = Object.assign(new Impl(data), data) // ...spread won't work
    try {
      return processNode({ root: mkdom(tmpl), data, deps, inner })
    } catch (e) {
      if (e.expr) Object.assign(e, getPosition(template, e))
      throw e
    }
  }

  return {
    name,
    tagName: node.tagName,
    create,

    render: function(data, deps) {
      const node = create(data, deps)

      // cleanup / remove dummy elements
      walk(node, el => { if (el.attribs?.__remove) removeElement(el) })

      return getOuterHTML(node)
    }
  }
}

function appendData(node, data) {
  const script = `\n  <script type="application/json">${JSON.stringify(data)}</script>\n`
  DOM.appendChild(node.firstChild || node, parseDocument(script))
}

function setJSONData(node, ctx) {
  const { attribs } = node
  const json = {}
  for (const key in attribs) {
    if (key[0] == ':') {
      const expr = getDel(key, attribs)
      const val = exec(setContext(expr), ctx)
      const real = key.slice(1)
      if (['id', 'class'].includes(real) || real.startsWith('data-')) {
        if (val) attribs[real] = val
      } else {
        json[real] = val
      }
    }
  }
  if (Object.keys(json)[0]) appendData(node, json)
}


export function parse(template) {
  const { children } = mkdom(template)
  const nodes = children.filter(el => el.type == 'tag')
  const global_js = getJS(children)
  return nodes.map(node => createComponent(node, global_js, template))
}

export function render(template, data, deps) {
  try {
    const comps = parse(template)
    if (Array.isArray(deps)) comps.push(...deps)
    return comps[0] ? comps[0].render(data, comps) : ''
  } catch (e) {
    if (e.expr) Object.assign(e, getPosition(template, e))
    throw e
  }
}

export async function parseFile(path) {
  const src = await fs.readFile(path, 'utf-8')
  return parse(src)
}

export async function renderFile(path, data, deps) {
  const src = await fs.readFile(path, 'utf-8')
  return render(src, data, deps)
}


