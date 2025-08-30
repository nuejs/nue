
// TODO: use html5.js
const caseSensitive = ['foreignObject', 'clipPath', 'linearGradient', 'radialGradient', 'textPath', 'animateMotion', 'animateTransform']

const voidTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']

function createNode(nodeType, tagName = null) {
  return {
    nodeType, // 1=element, 3=text, 11=fragment
    tagName: tagName?.toUpperCase(),
    innerHTML: '',
    children: [],
    childNodes: [],
    attributes: new AttributeMap(),
    classList: createClassList(),
    parentNode: null
  }
}

class AttributeMap extends Map {
  *[Symbol.iterator]() {
    for (const [name, value] of super[Symbol.iterator]()) {
      yield { name, value }
    }
  }
}

function createClassList() {
  const classes = new Set()
  return {
    classes,
    add(...names) {
      names.forEach(name => { if (name) classes.add(name) })
    },
    get length() { return classes.size },
    toString() { return Array.from(classes).join(' ') }
  }
}

function serialize(node) {
  if (node.nodeType == 3) return node._textContent || node.textContent

  // fragments
  if (node.nodeType == 11) return node.children.map(serialize).join('')

  const lowerTag = node.tagName.toLowerCase()
  const tag = caseSensitive.find(name => name.toLowerCase() == lowerTag) || lowerTag

  const attrs = []

  // add classList if it has classes and no class attribute already set
  if (node.classList && node.classList.length > 0 && !node.attributes.has('class')) {
    attrs.push(`class="${node.classList.toString()}"`)
  }

  for (const attr of node.attributes) {
    attrs.push(`${attr.name}="${attr.value}"`)
  }

  const attrStr = attrs.length ? ' ' + attrs.join(' ') : ''
  const children = node.children.map(serialize).join('')

  // self-closing tags
  if (voidTags.includes(tag)) return `<${tag}${attrStr}>`

  return `<${tag}${attrStr}>${children}</${tag}>`
}

function createElement(tag, nodeType = 1) {
  const base = createNode(nodeType, tag)
  const fns = {}

  const element = {
    ...base,

    // methods
    appendChild(child) {
      if (!child) return child
      child.parentNode = this
      this.children.push(child)
      this.childNodes.push(child)
      return child
    },

    removeChild(child) {
      const index = this.children.indexOf(child)
      if (index > -1) {
        this.children.splice(index, 1)
        this.childNodes.splice(index, 1)
        child.parentNode = null
      }
      return child
    },

    replaceChild(newChild, oldChild) {
      const index = this.children.indexOf(oldChild)
      if (index > -1) {
        this.children[index] = newChild
        this.childNodes[index] = newChild
        newChild.parentNode = this
        oldChild.parentNode = null
      }
      return oldChild
    },

    setAttribute(name, value) {
      this.attributes.set(name, String(value))

      if (name == 'class') {
        this.classList.classes.clear()
        this.classList.add(value)
      }
    },

    getAttribute(name) {
      return this.attributes.get(name) || null
    },

    hasAttribute(name) {
      return this.attributes.has(name)
    },

    removeAttribute(name) {
      this.attributes.delete(name)
      if (name == 'class') {
        this.classList.classes.clear()
      }
    },

    replaceWith(...nodes) {
      if (!this.parentNode) return

      const parent = this.parentNode
      const index = parent.children.indexOf(this)

      if (index > -1) {
        parent.children.splice(index, 1, ...nodes)
        parent.childNodes.splice(index, 1, ...nodes)
        nodes.forEach(node => node.parentNode = parent)
        this.parentNode = null
      }
    },

    // only element selectors needed (on test suite)
    querySelector(query) {
      if (this.tagName == query.toUpperCase()) return this

      for (let child of this.children) {
        const el = child.querySelector?.(query)
        if (el) return el
      }
    },

    // event handling
    addEventListener(name, fn) {
      fns[name] = fn
    },

    dispatchEvent(e) {
      const fn = fns[e.type]
      fn?.({ target: this, ...e })
    },

    // getters
    get firstChild() {
      return this.childNodes[0]
    },

    get innerHTML() {
      return this.children.map(serialize).join('')
    },

    get outerHTML() {
      return serialize(this)
    },

    // Add this to your createElement function in the element object:
    get textContent() {
      let text = ''
      for (let child of this.childNodes) {
        text += child.textContent || ''
      }
      return text
    },

    set innerHTML(html) {
      this.children.length = 0
      this.childNodes.length = 0

      // TODO: html parsing instead of textContent
      if (html) {
        const textNode = createNode(3)
        textNode.textContent = html
        this.appendChild(textNode)
      }
    }
  }

  return element
}

export function createDocument() {
  return {
    createElement,

    createElementNS(ns, tag) {
      return createElement(tag) // simplified
    },


    createTextNode(text) {
      const node = createNode(3)
      node.textContent = text ?? ''
      return node
    },

    createDocumentFragment() {
      return createElement(null, 11)
    },

    body: createElement('body')
  }
}