// ../../nuejs/src/browser/for.js
function for_default(opts) {
  const { root, fn, fns, deps, ctx } = opts;
  var anchor, current, items, $keys, $index, is_object_loop, blocks = [];
  function createProxy(item) {
    return new Proxy({}, {
      get(__, key) {
        if (is_object_loop) {
          const i = $keys.indexOf(key);
          if (i >= 0)
            return item[i];
        }
        return key === $keys ? item : $keys.includes(key) ? item[key] : key == $index ? items.indexOf(item) : ctx[key];
      }
    });
  }
  function mountItem(item, i, arr, first) {
    const block = createApp({ fns, dom: root.cloneNode(true) }, createProxy(item), deps, ctx);
    blocks[first ? "unshift" : "push"](block);
    block.before(first || anchor);
    ctx.oninsert?.call(ctx, block.$el, item, {
      index: i,
      is_repaint: !!arr,
      is_first: !i,
      is_last: i == items.length - 1,
      items
    });
  }
  function repaint() {
    blocks.forEach((el) => el.unmount());
    blocks = [];
    items.forEach(mountItem);
  }
  function arrProxy(arr) {
    const { unshift, splice, push, sort, reverse } = arr;
    return Object.assign(arr, {
      push(item) {
        push.call(items, item);
        mountItem(item, items.length - 1);
      },
      unshift(item) {
        unshift.call(items, item);
        mountItem(item, 0, null, blocks[0].$el);
      },
      sort(fn2) {
        sort.call(items, fn2);
        repaint();
      },
      reverse() {
        reverse.call(items);
        repaint();
      },
      splice(i, len) {
        blocks.slice(i, i + len).forEach((el) => el.unmount());
        blocks.splice(i, len);
        splice.call(items, i, len);
      },
      shift() {
        arr.splice(0, 1);
      },
      pop() {
        arr.splice(arr.length - 1, 1);
      },
      remove(item) {
        const i = items.indexOf(item);
        if (i >= 0)
          arr.splice(i, 1);
      }
    });
  }
  function update() {
    var arr;
    [$keys, arr = [], $index, is_object_loop] = fn(ctx);
    if (items) {
      if (arr !== current) {
        items = arrProxy(arr);
        repaint();
        current = arr;
      }
      return blocks.forEach((el) => el.update());
    }
    if (arr) {
      const p = root.parentElement;
      anchor = new Text("");
      p.insertBefore(anchor, root);
      p.removeChild(root);
      items = arrProxy(arr);
      arr.forEach(mountItem);
      current = arr;
    }
  }
  return { update };
}

// ../../nuejs/src/browser/if.js
function if_default(opts) {
  const { root, fn, fns, deps, ctx } = opts;
  const blocks = [];
  var node = root;
  var anchor;
  var next;
  function addBlock(node2, fn2) {
    opts.processAttrs(node2);
    const impl = createApp({ fns, dom: node2 }, ctx, deps, ctx);
    blocks.push(impl);
    impl.fn = fn2;
  }
  addBlock(root, fn);
  while (node = node.nextElementSibling) {
    const val = node.getAttribute(":else-if");
    if (val) {
      addBlock(node, fns[val]);
      node.removeAttribute(":else-if");
    } else if (node.hasAttribute(":else")) {
      addBlock(node, () => true);
      node.removeAttribute(":else");
    } else {
      next = node;
      break;
    }
  }
  function update() {
    if (!anchor) {
      const wrap = root.parentElement;
      anchor = new Text("");
      wrap.insertBefore(anchor, root);
    }
    const active = blocks.find((bl) => bl.fn(ctx));
    blocks.forEach((bl) => bl == active ? bl.before(anchor) : bl.unmount());
  }
  return { update, next };
}

// ../../nuejs/src/browser/nue.js
var mkdom = function(tmpl) {
  const el = document.createElement("_");
  el.innerHTML = tmpl.trim();
  return el.firstChild;
};
var renderVal = function(val, separ = "") {
  return val?.join ? val.filter((el) => el || el === 0).join(separ).trim().replace(/\s+/g, " ") : val || "";
};
var mergeVals = function(a, b) {
  if (a == b)
    return [a];
  if (!a.join)
    a = [a];
  if (b && !b.join)
    b = [b];
  return a.concat(b);
};
var CONTROL_FLOW = { ":if": if_default, ":for": for_default };
var CORE_ATTR = ["class", "style", "id"];
function createApp(component, data = {}, deps = [], $parent = {}) {
  const { Impl, tmpl, fns = [], dom, inner } = component;
  const expr = [];
  function walk(node) {
    const type = node.nodeType;
    if (type == 3) {
      const [_, i] = /:(\d+):/.exec(node.textContent.trim()) || [];
      const fn = fns[i];
      if (fn)
        expr.push((_2) => node.textContent = renderVal(fn(ctx)));
    }
    if (type == 1) {
      for (const key in CONTROL_FLOW) {
        const fn = fns[node.getAttribute(key)];
        if (key == ":if" && fn && node.getAttribute(":for")) {
          if (fn(ctx))
            continue;
          else
            node.removeAttribute(":for");
        }
        if (fn) {
          node.removeAttribute(key);
          const ext = CONTROL_FLOW[key]({ root: node, fn, fns, deps, ctx, processAttrs });
          expr.push(ext.update);
          return ext;
        }
      }
      const tagName = node.tagName.toLowerCase();
      const next = node.nextSibling;
      if (inner && tagName == "slot") {
        inner.replace(node);
        return { next };
      }
      const child = deps.find((el) => el.name == tagName);
      if (child) {
        if (node.firstChild) {
          const dom2 = document.createElement("_");
          dom2.append(...node.childNodes);
          child.inner = createApp({ fns, dom: dom2 }, ctx, deps);
        }
        const parent = createParent(node);
        const comp = createApp(child, ctx, deps, parent).mount(node);
        if (dom?.tagName.toLowerCase() == child.name)
          self.$el = comp.$el;
        expr.push((_) => setAttrs(comp.$el, parent));
        self.$refs[node.getAttribute("ref") || tagName] = comp.impl;
        return { next };
      } else {
        processAttrs(node);
        walkChildren(node, walk);
      }
    }
  }
  function processAttrs(node) {
    for (const el of [...node.attributes]) {
      processAttr(node, el.name, el.value);
    }
  }
  function setAttr(node, key, val) {
    const orig = node.getAttribute(key);
    if (orig !== val)
      node.setAttribute(key, val);
  }
  function processAttr(node, name, value) {
    if (name == "ref" || name == "name")
      self.$refs[value] = node;
    const fn = fns[value];
    if (!fn)
      return;
    const real = name.slice(1);
    const char = name[0];
    if (":@$".includes(char))
      node.removeAttribute(name);
    if (real == "attr") {
      return expr.push((_) => {
        for (const [name2, val] of Object.entries(fn(ctx))) {
          setAttr(node, name2, val === true ? "" : val);
        }
      });
    }
    if (char == ":") {
      if (real != "bind") {
        expr.push((_) => {
          let val = fn(ctx);
          setAttr(node, real, renderVal(val));
        });
      }
    } else if (char == "@") {
      node[`on${real}`] = (evt) => {
        fn.call(ctx, ctx, evt);
        const up = $parent?.update || update;
        up();
      };
    } else if (char == "$") {
      expr.push((_) => {
        const flag = node[real] = !!fn(ctx);
        if (!flag)
          node.removeAttribute(real);
      });
    }
    if (real == "html")
      expr.push((_) => node.innerHTML = fn(ctx));
  }
  function walkChildren(node, fn) {
    let child = node.firstChild;
    while (child) {
      child = fn(child)?.next || child.nextSibling;
    }
  }
  function getAttr(node, key) {
    const val = node.getAttribute(":" + key);
    const fn = fns[val];
    return fn ? fn(ctx) : ctx[val] || node.getAttribute(key) || node[key] || undefined;
  }
  function getAttrs(node) {
    const attr = {};
    for (const el of [...node.attributes]) {
      const name = el.name.replace(":", "");
      const val = getAttr(node, name);
      if (!CORE_ATTR.includes(name) && typeof val != "object") {
        attr[name] = val == null ? true : val;
      }
    }
    return attr;
  }
  function createParent(node) {
    node.$attrs = getAttrs(node);
    return new Proxy(node, {
      get(__, key) {
        return getAttr(node, key);
      }
    });
  }
  function setAttrs(root, parent) {
    const arr = mergeVals(getAttr(root, "class") || [], parent.class);
    if (arr[0])
      root.className = renderVal(arr, " ");
    const { id, style } = parent;
    if (style && style.x != "")
      root.style = renderVal(style);
    if (id)
      root.id = renderVal(id);
  }
  function update(obj) {
    if (obj)
      Object.assign(impl, obj);
    expr.map((el) => el());
    impl.updated?.call(ctx, ctx);
    return self;
  }
  let impl = {};
  const self = {
    update,
    $el: dom,
    get root() {
      return self.$el;
    },
    $refs: {},
    $parent,
    impl,
    mountChild(name, wrap, data2) {
      const comp = deps.find((el) => el.name == name);
      if (comp) {
        const app = createApp(comp, data2, deps, ctx);
        app.mount(wrap);
      }
    },
    mount(wrap) {
      const root = dom || (self.$el = mkdom(tmpl));
      let script = wrap.querySelector("script");
      if (script) {
        Object.assign(data, JSON.parse(script.textContent));
        wrap.insertAdjacentElement("afterend", script);
      }
      if (Impl)
        impl = self.impl = new Impl(ctx);
      impl.mountChild = self.mountChild;
      impl.$refs = self.$refs;
      impl.update = update;
      walk(root);
      wrap.replaceWith(root);
      for (const a of [...wrap.attributes])
        setAttr(root, a.name, a.value);
      impl.mounted?.call(ctx, ctx);
      return update();
    },
    append(to) {
      const wrap = document.createElement("b");
      to.append(wrap);
      return self.mount(wrap);
    },
    replace(wrap) {
      walk(dom);
      wrap.replaceWith(...dom.children);
      update();
    },
    before(anchor) {
      if (dom) {
        self.$el = dom;
        if (!document.body.contains(dom))
          anchor.before(dom);
        if (!dom.walked) {
          walk(dom);
          dom.walked = 1;
        }
        return update();
      }
    },
    unmount() {
      try {
        self.root.remove();
      } catch (e) {
      }
      impl.unmounted?.call(ctx, ctx);
      update();
    }
  };
  const ctx = new Proxy({}, {
    get(__, key) {
      for (const el of [self, impl, data, $parent, $parent.bind]) {
        const val = el && el[key];
        if (val != null)
          return val;
      }
    },
    set(__, key, val) {
      if ($parent && $parent[key] !== undefined) {
        $parent[key] = val;
        $parent.update();
      } else {
        if (Object.prototype.hasOwnProperty.call(impl, key)) {
          impl[key] = val;
        } else {
          self[key] = val;
        }
      }
      return true;
    }
  });
  return self;
}
export {
  createApp as default,
  createApp
};
