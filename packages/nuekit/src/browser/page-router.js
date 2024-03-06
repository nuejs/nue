
// Router for multi-page applications

export async function loadPage(path) {
  dispatchEvent(new Event('before:route'))

  // DOM of the new page
  const dom = mkdom(await getHTML(path))

  // change title
  document.title = $('title', dom)?.textContent

  // inline CSS
  const new_styles = swapStyles($$('style'), $$('style', dom))
  new_styles.forEach(style => $('head').appendChild(style))

  // body class
  $('body').classList = $('body2', dom).classList

  // external CSS
  const paths = swapStyles($$('link'), $$('link', dom))


  loadCSS(paths, () => {
    updateHTML(dom)
    setActive(path)
    scrollTo(0, 0)
    dispatchEvent(new Event('route'))
  })
}

function updateHTML(dom) {

  for (const query of ['header', 'main', 'footer']) {
    const a = $('body >' + query)
    const b = $('body2 >' + query, dom)

    // patch (with primitive DOM diffing)
    if (a && b) {
      if (a.outerHTML != b.outerHTML) a.replaceWith(b)

    // remove original
    } else if (a) {
      a.remove()

    // add new one
    } else if (b) {
      const fn = query == 'footer' ? 'append' : 'prepend'
      document.body[fn](b)
    }
  }
}



// setup linking
export function onclick(root, fn) {

  root.addEventListener('click', e => {
    const el = e.target.closest('[href]')
    const path = el?.getAttribute('href')
    const target = el?.getAttribute('target')

    // event ignore
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
      !path || path[0] == '#' || path.includes('//') || path.startsWith('mailto:') ||
      target == '_blank') return

    // all good
    if (path != location.pathname) fn(path)
    e.preventDefault()

  })
}

export function setActive(path, attrname='active') {

  // remove old selections
  $$(`[${attrname}]`).forEach(el => el.removeAttribute(attrname))

  // add new ones
  $$(`[href="${path}"]`).forEach(el => el.toggleAttribute(attrname, true))
}


// browser environment
const is_browser = typeof window == 'object'

if (is_browser) {

  // Fix: window.onpopstate, event.state == null?
  // https://stackoverflow.com/questions/11092736/window-onpopstate-event-state-null
  history.pushState({ path: location.pathname }, 0)

  // autoroute / document clicks
  onclick(document, async path => {
    document.startViewTransition(async function() {
      console.info('asdlfkjasd')
      await loadPage(path)
      history.pushState({ path }, 0, path)
    })
  })

  // initial active
  setActive(location.pathname)

  // back button
  addEventListener('popstate', e => {
    const { path } = e.state || {}
    if (path) loadPage(path)
  })
}




/* -------- utilities ---------- */

// view transition fallback (Safari, Firefox) • caniuse.com/view-transitions
if (!document.startViewTransition) {
  document.startViewTransition = (fn) => fn()
}

function $(query, root=document) {
  return root.querySelector(query)
}

function $$(query, root=document) {
  return [ ...root.querySelectorAll(query)]
}

function hasStyle(sheet, sheets) {
  return sheets.find(el => el.getAttribute('href') == sheet.getAttribute('href'))
}

function swapStyles(orig, styles) {

  // disable / enable
  orig.forEach((el, i) => el.disabled = !hasStyle(el, styles))

  // add new
  return styles.filter(el => !hasStyle(el, orig))
}

const cache = {}

async function getHTML(path) {
  if (!cache[path]) {
    const resp = await fetch(path)
    cache[path] = await resp.text()
  }
  return cache[path]
}

function mkdom(html) {

  // template tag does not work with <body> tag
  html = html.replace(/<(\/?)body/g, '<$1body2')

  const tmpl = document.createElement('template')
  tmpl.innerHTML = html.trim()
  return tmpl.content
}

function loadCSS(paths, fn) {
  let loaded = 0

  !paths[0] ? fn() : paths.forEach((el, i) => {
    loadSheet(el.href, () => { if (++loaded == paths.length) fn() })
  })
}

function loadSheet(path, fn) {
  const el = document.createElement('link')
  el.rel = 'stylesheet'
  el.href = path
  $('head').appendChild(el)
  el.onload = fn
}



