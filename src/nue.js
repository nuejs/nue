
import For from './for.js'
import If from './if.js'

const CONTROL_FLOW = { ':if': If, ':for': For } // :if must be first
const CORE_ATTR = ['class', 'style', 'id']


/**
 * Creates a new application instance (aka. reactive component)
 *
 * https://nuejs.org/docs/nuejs/reactive-components.html
 *
 * @typedef {{ name: string, tagName: string, tmpl: string, ... }} Component
 * @param { Component } component - a (compiled) component instance to be mounted
 * @param { Object } [data = {}] - optional data or data model for the component
 * @param { Array<Component> } [deps = {}] - optional array of nested/dependant components
 * @param { Object } $parent - (for internal use only)
*/
export default function createApp(component, data={}, deps=[], $parent={}) {
  const { Impl, tmpl, fns=[], dom, inner } = component
  const expr = []

  function walk(node) {
    const type = node.nodeType

    // text content
    if (type == 3) {
      const [_, i] = /:(\d+):/.exec(node.textContent.trim()) || []
      const fn = fns[i]
      if (fn) expr.push(_ => node.textContent = renderVal(fn(ctx)))
    }

    // element
    if (type == 1) {

      // loops & conditionals
      for (const key in CONTROL_FLOW) {
        const fn = fns[node.getAttribute(key)]

        // TODO: for + if work reactively on the same node
        if (key == ':if' && fn && node.getAttribute(':for')) {

          // if (true) -> quick continue
          if (fn(ctx)) continue

          // if (false) -> disable for loop
          else node.removeAttribute(':for')
        }

        if (fn) {
          node.removeAttribute(key)
          const ext = CONTROL_FLOW[key]({ root: node, fn, fns, deps, ctx, processAttrs })
          expr.push(ext.update)
          return ext
        }
      }

      const tagName = node.tagName.toLowerCase()
      const next = node.nextSibling

      // slot
      if (inner && tagName == 'slot') {
        inner.replace(node)
        return { next }
      }

      // custom child
      const child = deps.find(el => el.name == tagName)

      if (child) {

        // inner <slot/> content
        if (node.firstChild) {
          const dom = document.createElement('_')
          dom.append(...node.childNodes)
          child.inner = createApp({ fns, dom }, ctx, deps)
        }

        const parent = createParent(node)
        const comp = createApp(child, ctx, deps, parent).mount(node)

        // Root node changes -> re-point to the new DOM element
        if (dom?.tagName.toLowerCase() == child.name) self.$el = comp.$el

        expr.push(_ => setAttrs(comp.$el, parent))

        // component refs
        self.$refs[node.getAttribute('ref') || tagName] = comp.impl

        return { next }

      } else {
        processAttrs(node)
        walkChildren(node, walk)
      }
    }
  }

  function processAttrs(node) {
    for (const el of [...node.attributes]) {
      processAttr(node, el.name, el.value)
    }
  }

  function setAttr(node, key, val) {
    const orig = node.getAttribute(key)
    if (orig !== val) node.setAttribute(key, val)
  }

  function processAttr(node, name, value) {
    if (name == 'ref' || name == 'name') self.$refs[value] = node

    const fn = fns[value]
    if (!fn) return

    const real = name.slice(1)
    const char = name[0]

    // remove special attributes
    if (':@$'.includes(char)) node.removeAttribute(name)


    // set all attributes from object
    if (real == 'attr') {
      return expr.push(_=> {
        for (const [name, val] of Object.entries(fn(ctx))) {
          setAttr(node, name, val === true ? '' : val)
        }
      })
    }

    if (char == ':') {
      if (real != 'bind') {
        // dynamic attributes
        expr.push(_ => {
          let val = fn(ctx)
          setAttr(node, real, renderVal(val))
        })
      }
    } else if (char == '@') {
      // event handler
      node[`on${real}`] = evt => {
        fn.call(ctx, ctx, evt)
        const up = $parent?.update || update
        up()
      }
    } else if (char == '$') {
      // boolean attribute
      expr.push(_ => {
        const flag = node[real] = !!fn(ctx)
        if (!flag) node.removeAttribute(real)
      })
    }

    // html
    if (real == 'html') expr.push(_=> node.innerHTML = fn(ctx))

  }

  function walkChildren(node, fn) {
    let child = node.firstChild
    while (child) {
      child = fn(child)?.next || child.nextSibling
    }
  }

  // node[key] --> dataset, node.title = '' -> undefined (to not override :bind)
  function getAttr(node, key) {
    const val = node.getAttribute(':' + key)
    const fn = fns[val]
    return fn ? fn(ctx) : ctx[val] || node.getAttribute(key) || node[key] || undefined
  }

  // non-core (id, class, style) attributes with primitive value
  function getAttrs(node) {
    const attr = {}
    for (const el of [...node.attributes]) {
      const name = el.name.replace(':', '')
      const val = getAttr(node, name)
      if (!CORE_ATTR.includes(name) && typeof(val) != 'object') {
        attr[name] = val == null ? true : val
      }
    }
    return attr
  }

  function createParent(node) {
    node.$attrs = getAttrs(node)
    return new Proxy(node, {
      get(__, key) {
        return getAttr(node, key)
      }
    })
  }

  function setAttrs(root, parent) {
    const arr = mergeVals(getAttr(root, 'class') || [], parent.class)
    if (arr[0]) root.className = renderVal(arr, ' ')

    const { id, style } = parent
    if (style && style.x != '') root.style = renderVal(style)
    if (id) root.id = renderVal(id)
  }

  function update(obj) {
    if (obj) Object.assign(impl, obj)
    expr.map(el => el())
    impl.updated?.call(ctx, ctx)
    return self
  }


  // context
  let impl = {}

  const self = {
    update,

    $el: dom,

    // root === $el
    get root() { return self.$el },

    $refs: {},

    $parent,

    impl,

    mountChild(name, wrap, data) {
      const comp = deps.find(el => el.name == name)
      if (comp) {
        const app = createApp(comp, data, deps, ctx)
        app.mount(wrap)
      }
    },

    mount(wrap) {
      const root = dom || (self.$el = mkdom(tmpl))

      // Isomorphic JSON. Saved for later hot-reloading
      let script = wrap.querySelector('script')
      if (script) {
        Object.assign(data, JSON.parse(script.textContent))
        wrap.insertAdjacentElement('afterend', script)
      }

      // setup refs

      // constructor
      if (Impl) {
        impl = self.impl = new Impl(ctx)

        // for
        impl.mountChild = self.mountChild
        impl.$refs = self.$refs
        impl.update = update
      }

      walk(root)

      wrap.replaceWith(root)

      // copy root attributes
      for (const a of [...wrap.attributes]) setAttr(root, a.name, a.value)

      // callback: mounted()
      impl.mounted?.call(ctx, ctx)

      return update()
    },

    append(to) {
      const wrap = document.createElement('b')
      to.append(wrap)
      return self.mount(wrap)
    },

    // used by slots
    replace(wrap) {
      walk(dom)
      wrap.replaceWith(...dom.children)
      update()
    },

    // used by loops and conditionals
    before(anchor) {
      if (dom) {
        self.$el = dom

        // TODO: more performant check?
        if (!document.body.contains(dom)) anchor.before(dom)
        if (!dom.walked) { walk(dom); dom.walked = 1 }
        return update()
      }
    },

    unmount() {
      try {
        self.root.remove()
      } catch (e) {}
      impl.unmounted?.call(ctx, ctx)
      update()
    }

  }

  const ctx = new Proxy({}, {
    get(__, key) {

      // keep this order
      for (const el of [self, impl, data, $parent, $parent.bind]) {
        const val = el && el[key]
        if (val != null) return val
      }
    },

    set(__, key, val) {

      // parent key? (loop items)
      if ($parent && $parent[key] !== undefined) {
        $parent[key] = val
        $parent.update()

      } else {
        self[key] = val
      }
      return true
    }

  })

  return self

}

// good for async import
export { createApp }


function mkdom(tmpl) {
  const el = document.createElement('_')
  el.innerHTML = tmpl.trim()
  return el.firstChild
}


// render expression return value
function renderVal(val, separ='') {
  return val?.join ? val.filter(el => el || el === 0).join(separ).trim().replace(/\s+/g, ' ') : val || ''
}

// to merge the class attribute from original mount point
function mergeVals(a, b) {
  if (a == b) return [a]
  if (!a.join) a = [a]
  if (b && !b.join) b = [b]
  return a.concat(b)
}

