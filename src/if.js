
// Internal use only

import createApp from './nue.js'

export default function(opts) {
  const { root, fn, fns, deps, ctx } = opts
  const blocks = []
  var node = root
  var anchor
  var next

  function addBlock(node, fn) {
    opts.processAttrs(node) // run event handlers on the parent context
    const impl = createApp({ fns, dom: node }, ctx, deps, ctx)
    blocks.push(impl)
    impl.fn = fn
  }

  addBlock(root, fn)

  while (node = node.nextElementSibling) {
    const val = node.getAttribute(':else-if')
    if (val) {
      addBlock(node, fns[val])
      node.removeAttribute(':else-if')

    } else if (node.hasAttribute(':else')) {
      addBlock(node, () => true)
      node.removeAttribute(':else')

    } else {
      next = node
      break
    }
  }

  var _prev

  function update() {
    if (!anchor) {
      const wrap = root.parentElement
      anchor = new Text('')
      wrap.insertBefore(anchor, root)
    }

    const active = blocks.find(bl => bl.fn(ctx))
    blocks.forEach(bl => bl == active ? bl.before(anchor) : bl.unmount())
  }

  return { update, next }

}
