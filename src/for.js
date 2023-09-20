
// Internal use only

import createApp from './nue.js'

export default function(opts) {
  const { root, fn, fns, deps, ctx } = opts
  var anchor, current, items, $keys, $index, is_object_loop, blocks = []


  function createProxy(item) {
    return new Proxy({}, {
      get(__, key) {
        if (is_object_loop) {
          const i = $keys.indexOf(key)
          if (i >= 0) return item[i]
        }
        return key === $keys ? item :
          $keys.includes(key) ? item[key] :
          key == $index ? items.indexOf(item) :
          ctx[key]
      }
    })
  }

  function mountItem(item, i, arr, first) {
    const block = createApp({ fns, dom: root.cloneNode(true) }, createProxy(item), deps, ctx)

    blocks[first ? 'unshift' : 'push'](block)
    block.before(first || anchor)

    // oninsert callback for transition/animation purposes
    ctx.oninsert?.call(ctx, block.$el, item, {
      index: i,
      is_repaint: !!arr,
      is_first: !i,
      is_last: i == items.length -1,
      items
    })

  }

  function repaint() {
    blocks.forEach(el => el.unmount())
    blocks = []
    items.forEach(mountItem)
  }

  function arrProxy(arr) {
    const { unshift, splice, push, sort, reverse } = arr

    return Object.assign(arr, {

      // adding
      push(item) {
        push.call(items, item)
        mountItem(item, items.length - 1)
      },

      unshift(item) {
        unshift.call(items, item)
        mountItem(item, 0, null, blocks[0].$el)
      },

      // sorting
      sort(fn) {
        sort.call(items, fn)
        repaint()
      },

      reverse() {
        reverse.call(items)
        repaint()
      },

      // removing
      splice(i, len) {
        blocks.slice(i, i + len).forEach(el => el.unmount())
        blocks.splice(i, len)
        splice.call(items, i, len)
      },

      shift() { arr.splice(0, 1) },

      pop() { arr.splice(arr.length -1, 1) },

      // handy shortcut for a common operation
      remove(item) {
        const i = items.indexOf(item)
        if (i >= 0) arr.splice(i, 1)
      }
    })
  }

  // update function
  function update() {
    var arr
    [$keys, arr, $index, is_object_loop] = fn(ctx)

    if (items) {
      // change of current array --> repaint
      if (arr !== current) {
        items = arrProxy(arr); repaint(); current = arr
      }
      return blocks.forEach(el => el.update())
    }

    if (arr) {
      // anchor
      const p = root.parentElement
      anchor = new Text('')
      p.insertBefore(anchor, root)

      p.removeChild(root)
      items = arrProxy(arr)
      arr.forEach(mountItem)
      current = arr
    }
  }

  return { update }

}