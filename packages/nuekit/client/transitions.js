// Client-side routing and view transitions for multipage applications

function $(query, root = document) {
  return root.querySelector(query)
}

function $$(query, root = document) {
  return [...root.querySelectorAll(query)]
}

const scrollPos = {}
const cache = {}

export async function loadPage(path) {
  dispatchEvent(new Event('before:route'))

  // DOM of the new page
  const dom = createDOM(await fetchHTML(path))

  // update page metadata and scripts
  await updatePageHead(dom)

  // update stylesheets
  const sheets = updatePageStyles(dom)
  await loadStylesheets(sheets)

  // inline style tag (single)
  updateInlineStyle($('style', dom))

  // update page content - keep the working logic
  const ignoreMain = updateContent($('main'), $('main', dom))
  updateContent($('body'), $('body', dom), ignoreMain)
  dispatchRouteEvents()
  setActive(path)
}

async function updatePageHead(dom) {
  // title
  const title = $('title', dom)?.textContent
  if (title) document.title = title

  // update component list
  updateMeta('libs', dom)

  // load scripts (modules are loaded only once by the browser)
  for (const script of $$('script[src]', dom)) {
    await import(script.getAttribute('src'))
  }
}


function updateMeta(name, dom) {
  $(`meta[name="${name}"]`)?.remove()
  const meta = $(`meta[name="${name}"]`, dom)
  if (meta) $('head').appendChild(meta)
}

function handlePageScroll() {
  const { hash } = location
  const el = hash && $(hash)
  const scrollTop = el ?
    el.offsetTop - (parseInt(getComputedStyle(el).scrollMarginTop) || 0) :
    0
  scrollTo(0, scrollTop)
}

function dispatchRouteEvents() {
  dispatchEvent(new Event('route'))
  const [_, app] = location.pathname.split('/')
  dispatchEvent(new Event(`route:${app || 'home'}`))
}

// setup linking
export function onclick(root, fn) {
  root.addEventListener('click', e => {
    const el = e.target.closest('[href]')
    if (!el) return

    const path = el.getAttribute('href')
    const target = el.getAttribute('target')
    const filename = path?.split('/')?.pop()?.split(/[#?]/)?.shift()

    if (shouldIgnoreClick(e, path, target, filename)) return

    // all good
    if (path != location.pathname) fn(el.pathname, el)
    e.preventDefault()
  })
}

function shouldIgnoreClick(e, path, target, filename) {
  return e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
    !path || path[0] == '#' || path.includes('//') || path.startsWith('mailto:') ||
    (filename?.includes('.') && !filename.endsWith('.html')) || !!target
}

export function toRelative(path) {
  const curr = location.pathname
  return curr.slice(0, curr.lastIndexOf('/') + 1) + path
}

export function setActive(path, attrname = 'aria-current') {
  if (path[0] != '/') path = toRelative(path)

  // remove old selections
  $$(`[${attrname}]`).forEach(el => el.removeAttribute(attrname))

  // add new ones
  $$('a').forEach(el => {
    if (!el.hash && el.pathname == path) {
      el.setAttribute(attrname, 'page')
    }
  })
}

export function setupTransitions() {
  // view transition fallback (Safari, Firefox) • caniuse.com/view-transitions
  if (!document.startViewTransition) {
    document.startViewTransition = (fn) => fn()
  }

  // Fix: window.onpopstate, event.state == null?
  // https://stackoverflow.com/questions/11092736/window-onpopstate-event-state-null
  history.pushState({ path: location.pathname }, 0)

  // save scroll position whenever user scrolls
  addEventListener('scroll', () => {
    scrollPos[location.pathname] = window.scrollY
  })

  // autoroute / document clicks
  onclick(document, async (path, el) => {
    const img = $('img', el)
    if (img) img.style.viewTransitionName = 'active-image'

    document.startViewTransition(async () => {
      await loadPage(path)
      history.pushState({ path }, 0, path)
      handlePageScroll()
    })
  })

  // initial active
  setActive(location.pathname)

  // back button
  addEventListener('popstate', e => {
    const { path } = e.state || {}

    if (path) {
      const pos = scrollPos[path]

      document.startViewTransition(async () => {
        await loadPage(path)
        scrollTo(0, pos || 0)
      })
    }
  })
}

/* -------- utilities ---------- */

function haveSameChildren(a, b) {
  if (a.children.length != b.children.length) return false

  for (let i = 0; i < a.children.length; i++) {
    if (a.children[i].tagName != b.children[i].tagName) return false
  }

  return true
}

// smart DOM diffing and updating
export function updateContent(current, incoming, ignoreMain) {
  if (!current || !incoming) return true

  if (haveSameChildren(current, incoming)) {
    Array.from(current.children).forEach((el, i) => {
      if (!(ignoreMain && el.tagName == 'MAIN')) {
        updateElement(el, incoming.children[i])
      }
    })
    return true
  } else {
    current.innerHTML = incoming.innerHTML
    return false
  }
}

function updateElement(current, incoming) {
  const currentHTML = current.outerHTML.replace(' aria-current="page"', '')
  if (currentHTML != incoming.outerHTML) {
    current.replaceWith(incoming.cloneNode(true))
  }
}

function updatePageStyles(dom) {
  const sheets = findNewStyles($$('link'), $$('link', dom))
  sheets.forEach(style => $('head').appendChild(style))
  return sheets
}

export function findNewStyles(current, incoming) {
  // disable styles not in incoming
  current.forEach(el => {
    const href = el.getAttribute('href')
    el.disabled = !incoming.find(style => style.getAttribute('href') == href)
  })

  // return styles not in current
  return incoming.filter(el => {
    const href = el.getAttribute('href')
    return !current.find(style => style.getAttribute('href') == href)
  })
}

function updateInlineStyle(style) {
  $('style')?.remove()
  if (style) $('head').appendChild(style)
}

async function fetchHTML(path) {
  let html = cache[path]
  if (html) return html

  const resp = await fetch(path)
  html = await resp.text()

  if (resp.status == 404 && html?.trim()[0] != '<') {
    const title = document.title = 'Page not found'
    $('article').innerHTML = `<section><h1>${title}</h1></section>`
  } else {
    cache[path] = html
  }

  return html
}

function createDOM(html) {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

async function loadStylesheets(linkElements) {
  const promises = linkElements.map(link => loadStylesheet(link.href))
  await Promise.all(promises)
}

function loadStylesheet(href) {
  return new Promise(resolve => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = resolve
    $('head').appendChild(link)
  })
}

// browser environment
if (typeof window == 'object') setupTransitions()

