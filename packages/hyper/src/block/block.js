
// Hyper • (c) 2025 Tero Piirainen & contributors, MIT Licensed

import { domdiff } from './domdiff.js'

const is_browser = typeof window == 'object'

export function createBlock(ast, data={}, opts={}, parent) {
  const { script } = ast
  let root

  Object.assign(data, getAttrData(ast, data))

  if (script) {
    try {
      if (typeof script == 'string') new Function(script).call(data)
      else script.call(data)

    } catch (e) {
      console.error('<script> error:', script, e)
    }
  }

  function fire(name, wrap) {
    const fn = data[name]
    if (wrap?.tagName) root = data.root = wrap
    if (is_browser && fn && typeof fn == 'function') return fn.call(data, data)
  }

  function mount(wrap) {
    fire('onmount', wrap)
    const frag = render(ast, data)
    wrap.appendChild(frag.firstChild)
    if (is_browser) fire('mounted')
  }

  function update(values) {
    if (values) Object.assign(data, values)

    if (fire('onupdate') !== false) {
      const frag = render(ast, data)
      domdiff(parent ? root : root.firstChild, frag.firstChild, parent ? root.parentNode : root)
      fire('updated')
    }

    /*
      The above domdiff clause combines these two purposes:

      // For browsers: root can be swapped (via initRoot)
      domdiff(root, frag.firstChild, parent ? root.parentNode : root)

      // Domino demands nodes are present or fails (no swapping allowed)
      domdiff(root?.firstChild, frag.firstChild, root)
    */
  }

  function render(_ast=ast, _data=data) {
    return _ast.text || _ast.fn ? renderText(_ast, _data) :
      _ast.some ? renderIf(_ast, _data) :
      _ast.for ? renderLoop(_ast, _data) :
      _ast.is_custom ? renderComponent(_ast, _data) :
      _ast.tag ? renderTag(_ast, _data) :
      createFragment()
  }

  function renderTag(ast, data) {
    const tag = document.createElement(ast.tag)

    setAttributes(tag, ast, data)
    if (parent && ast.is_child) setAttributes(tag, parent.ast, parent.data)

    const am = tag.classList.length
    if (am > (opts.max_class_names || 3)) {
      console.error(`Too many class names (${am}) for ${tag.tagName} tag`)
    }

    const cls = tag.className
    if (cls && /[:\[\]]/.test(cls)) {
      console.error(`Invalid characters in class name: ${cls}`)
    }


    ast.handlers?.forEach(h => {
      tag.addEventListener(h.name.slice(2), function(e) {
        exec(h.h_fn, data, e)
        update()
      })
    })

    ast.children?.forEach((child, i) => {
      if (child.slot) {
        // slot content from opts
        if (opts.slot) return tag.appendChild(renderHTML(opts.slot))

        parent?.ast.children?.forEach((node, i) => {
          tag.appendChild(render(node, parent.data))
          addSpace(tag, node, parent.ast.children[i + 1])
        })
      } else {
        tag.appendChild(render(child, data))
      }
      addSpace(tag, child, ast.children[i+1])
    })

    const frag = createFragment()
    frag.appendChild(tag)
    return frag
  }

  function renderIf(ast, data) {
    const child = ast.some.find(el => {
      const fn = el.if || el['else-if']
      return fn ? exec(fn, data) : true
    })
    return child ? render(child, data) : createFragment()
  }

  function renderLoop(impl, data) {
    const ast = { ...impl }
    const { keys, is_entries, index, fn } = ast.for
    delete ast.for

    const frag = createFragment()
    const is_template = ast.tag == 'template'
    const items = exec(fn, data) || []

    items.forEach((item, i) => {
      const loopData = { ...data }
      if (keys[1]) keys.forEach((key, i ) => loopData[key] = item[is_entries ? i : key])
      else loopData[keys[0]] = item
      if (index) loopData[index] = i

      if (is_template) {
        ast.children.forEach(child => {
          frag.appendChild(render(child, loopData))
        })
      } else {
        frag.appendChild(render(ast, loopData))
      }
    })
    return frag
  }

  function renderComponent(ast, data) {

    const attr_data = getAttrData(ast, data)

    // render function?
    const fn = opts.fns && opts.fns[ast.tag]
    if (fn) return renderHTML(fn({ ...attr_data, ...data }, opts))

    // find component
    const comp = findComponent(ast, data)

    if (!comp) return renderTag({
      attr: [{ name: 'type', val: 'application/json' }, { name: 'component', val: ast.tag }],
      children: [ {text: JSON.stringify(attr_data) }],
      tag: 'script',
    })

    const tag = ast.mount ? ast.tag : comp.is ? comp.tag : 'div'

    const block = createBlock(
      { ...comp, tag, is_custom: false, is_child: true },
      attr_data,
      opts,
      createBlock(ast, data, opts, parent)
    )
    const frag = block.render()
    block.fire('onmount', frag.firstChild)
    block.fire('mounted')
    return frag
  }

  function findComponent(ast, data) {
    let { mount, tag } = ast
    if (mount) tag = mount.fn ? exec(mount.fn, data) : mount.val
    return opts.lib?.find(c => c != ast && tag == (c.is || c.tag))
  }

  return {
    mount, update, render, ast, data, fire, get root() { return root },
  }
}

function renderText(ast, data) {
  const val = ast.fn ? exec(ast.fn, data) : ast.text || ''
  return ast.html ? renderHTML(val) : document.createTextNode(val)
}

function getAttrData(ast, data) {

  const ret = {}
  ast.attr?.forEach(a => {
    const val = a.fn ? exec(a.fn, { ...data, $concat }) : a.val
    if (a.name == 'bind') {
      if (typeof val == 'object') Object.assign(ret, val)
    } else {
      ret[a.name] = val
    }
  })
  return ret
}

function setAttributes(el, ast, data) {
  const vars = []

  ast.attr?.forEach(a => {
    if (a.is_data) return
    let { name, val, fn } = a
    if (fn) val = exec(fn, { ...data, $concat })

    if (a.is_var) {
      vars.push({ name, val })
    } else if (a.bool) {
      if (val) el.setAttribute(name, '')
    } else if (name == 'class') {
      el.classList.add(...val.split(/ +/))
    } else {
      el.setAttribute(name, val)
    }
  })

  if (vars.length) {
    el.setAttribute('style', vars.map(v => `--${v.name}:${v.val};`).join(''))
  }
}

function exec(fn, data, e) {
  try {
    if (typeof fn == 'string') fn = new Function('_', '$e', 'return ' + fn)
    let val = fn(data, e)
    return val == null ? '' : Number.isNaN(val) ? 'N/A' : val
  } catch (e) {
    console.error('Hyper error:', e.message)
    return '[Error]'
  }
}

function renderHTML(html) {
  const frag = createFragment()
  const temp = document.createElement('div')
  temp.innerHTML = html || ''
  while (temp.firstChild) frag.appendChild(temp.firstChild)
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