
// Nue • (c) 2025 Tero Piirainen & contributors, MIT Licensed

import { domdiff } from './diff.js'

const is_browser = typeof window == 'object'


export function createNode(ast, data={}, opts={}, parent) {
  const { script } = ast
  let root

  function update(values) {
    if (values) Object.assign(self, values)

    if (fire('onupdate') !== false) {
      const next = render(ast, self).firstChild

      // Domino: cannot be swapped (TODO: check with fakedom)
      if (is_browser || parent) domdiff(root, next, root.parentNode)
      else domdiff(root.firstChild, next, root)

      fire('updated')
    }
  }

  // Object.assign(self, getAttrData(ast, self))
  const self = { ...data, ...getAttrData(ast, data), update, parent }


  if (script) {
    try {
      if (typeof script == 'string') new Function(script).call(self)
      else script.call(self)

    } catch (e) {
      console.error('<script> error:', script, e)
    }
  }

  function fire(name, wrap) {
    const fn = self[name]
    if (wrap?.tagName) root = self.root = wrap
    if (is_browser && fn && typeof fn == 'function') return fn.call(self, self, update)
  }

  function mount(wrap) {
    fire('onmount', wrap)
    const frag = render(ast, self)
    const root = frag.firstChild
    is_browser ? wrap.replaceWith(root) : wrap.appendChild(root)
    if (is_browser) fire('mounted', root)
    return root
  }

  self.mount = function(name, wrap, data) {
    if (typeof wrap == 'string') wrap = root?.querySelector(wrap)
    const ast = opts.deps?.find(c => name == (c.is || c.tag))

    // convert to <div> (TODO: do this at compile time)
    if (ast.is_custom) { ast.is = ast.tag; ast.tag = 'div'; delete ast.is_custom }

    const block = createNode(ast, data, opts, self)
    block.mount(wrap)
  }


  function render(_ast=ast, data=self) {
    return _ast.text || _ast.fn ? renderText(_ast, data) :
      _ast.some ? renderIf(_ast, data) :
      _ast.for ? renderLoop(_ast, data) :
      _ast.is_custom ? renderComponent(_ast, data) :
      _ast.tag ? renderTag(_ast, data) :
      createFragment()
  }

  function renderTag(ast, self) {
    const tag = ast.svg ? document.createElementNS('http://www.w3.org/2000/svg', ast.tag) :
      document.createElement(ast.tag)

    setAttributes(tag, ast, self)
    if (parent && ast.is_child) setAttributes(tag, parent.ast, parent.self)

    const am = tag.classList.length
    if (am > (opts.max_class_names || 3)) {
      console.error(`Too many class names (${am}) for ${tag.tagName} tag`)
    }

    const cls = tag.classList?.toString()
    if (/[:\[\]]/.test(cls)) {
      console.error(`Invalid characters in class name: ${cls}`)
    }


    ast.handlers?.forEach(h => {
      const name = h.name.slice(2) // onclick --> click

      tag.addEventListener(name, function(e) {
        if (name == 'submit') e.preventDefault()
        exec(h.h_fn, self, e)
        update()
      })
    })

    ast.children?.forEach((child, i) => {
      if (child.slot) {
        // slot content from opts
        if (opts.slot) return tag.appendChild(renderHTML(opts.slot))

        parent?.ast.children?.forEach((node, i) => {
          tag.appendChild(render(node, parent.self))
          addSpace(tag, node, parent.ast.children[i + 1])
        })
      } else {
        tag.appendChild(render(child, self))
      }
      addSpace(tag, child, ast.children[i+1])
    })

    const frag = createFragment()
    frag.appendChild(tag)
    return frag
  }


  function renderIf(ast, self) {

    const child = ast.some.find(el => {
      const fn = el.if || el['else-if']
      if (fn) {
        const ret = exec(fn, self)
        return ret && ret != '[Error]'
      } else if (el.else) {
        return true
      }
    })

    if (!child) return createFragment()

    if (child.tag == 'template') {
      const frag = createFragment()
      child.children.forEach(node => {
        frag.appendChild(render(node, self))
      })
      return frag
    } else {
      return render(child, self)
    }
  }

  function renderLoop(impl, self) {
    const ast = { ...impl }
    const { keys, is_entries, index, fn } = ast.for
    delete ast.for

    const items = exec(fn, self) || []
    const frag = createFragment()
    const is_template = ast.tag == 'template'

    items.forEach((item, i) => {
      // set loop variables
      const child = { ...self }
      if (index) child[index] = i
      if (keys[1]) keys.forEach((key, i ) => child[key] = item[is_entries ? i : key])
      else child[keys[0]] = item

      if (is_template) {
        ast.children.forEach(node => {
          frag.appendChild(render(node, child))
        })
      } else {
        frag.appendChild(render(ast, child))
      }
    })
    return frag
  }

  function renderComponent(ast, self) {

    const attr_data = getAttrData(ast, self)

    // render function?
    const fn = opts.fns && opts.fns[ast.tag]
    if (fn) return renderHTML(fn({ ...attr_data, ...self }, opts))

    // find component
    const comp = findComponent(ast, self)
    if (!comp) return renderHTML(renderClientStub(ast.tag, attr_data))

    const tag = ast.mount && ast.tag != 'template' ? ast.tag : comp.is ? comp.tag : 'div'

    const block = createNode(
      { ...comp, tag, is_custom: false, is_child: true },
      attr_data,
      opts,
      createNode(ast, self, opts, parent)
    )

    const frag = block.render()
    block.fire('onmount', frag.firstChild)
    block.fire('mounted')
    return frag
  }

  function findComponent(ast, self) {
    let { mount, tag } = ast
    if (mount) tag = mount.fn ? exec(mount.fn, self) : mount.val
    return opts.deps?.find(c => c != ast && tag == (c.is || c.tag))
  }

  return {
    mount, update, render, ast, self, fire, get root() { return root },
  }
}

function renderText(ast, self) {
  const val = ast.fn ? exec(ast.fn, self) : ast.text || ''
  return ast.html ? renderHTML(val) : document.createTextNode(val)
}

function getAttrData(ast, self) {

  const ret = {}
  ast.attr?.forEach(a => {
    const val = a.fn ? exec(a.fn, { ...self, $concat }) : a.val
    if (a.name == 'bind') {
      if (typeof val == 'object') Object.assign(ret, val)
    } else {
      ret[a.name] = val
    }
  })
  return ret
}

function setAttributes(el, ast, self) {
  const vars = []

  ast.attr?.forEach(a => {
    if (a.is_data) return
    let { name, val, fn } = a
    if (fn) val = exec(fn, { ...self, $concat })

    if (a.is_var) {
      vars.push({ name, val })
    } else if (a.bool) {
      if (val) el.setAttribute(name, '')
    } else if (name == 'class') {
      el.classList.add(...val.trim().split(/ +/))
    } else {
      el.setAttribute(name, val)
    }
  })

  if (vars.length) {
    el.setAttribute('style', vars.map(v => `--${v.name}:${v.val};`).join(''))
  }
}

function exec(fn, self, e) {
  try {
    if (typeof fn == 'string') fn = new Function('_', '$e', 'return ' + fn)
    let val = fn(self, e)
    return val == null ? '' : Number.isNaN(val) ? 'N/A' : val
  } catch (e) {
    console.error('Nue error:', e.message)
    return '[Error]'
  }
}

function renderHTML(html) {
  const frag = document.createDocumentFragment()
  frag.innerHTML = html || ''
  return frag
}

function $concat(obj) {
  return Object.keys(obj).map(key => obj[key] ? key : '').filter(key => !!key).join(' ')
}

function createFragment() {
  return document.createDocumentFragment()
}

function addSpace(to, child, next) {
  if (child.tag && next?.tag || child.fn && next?.fn) {
    to.appendChild(document.createTextNode(' '))
  }
}

function renderClientStub(tag, self) {
  const json = JSON.stringify(self)
  const js = json != '{}' ? `<script type="application/json">${json}</script>` : ''
  return `<${tag} nue="${tag}"></${tag}>${js}`
}

