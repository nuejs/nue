// Router for multi-page applications

// exported
export function $(query, root = document) {
  return root.querySelector(query)
}

export function $$(query, root = document) {
  return [...root.querySelectorAll(query)]
}

const scrollPos = {}

export async function loadPage(path, replace_state) {
  dispatchEvent(new Event('before:route'))

  // save scroll position
  scrollPos[location.pathname] = window.scrollY

  if (!replace_state) history.pushState({ path }, 0, path)

  // DOM of the new page
  const dom = mkdom(await getHTML(path))

  // change title
  const title = $('title', dom)?.textContent
  if (title) document.title = title

  // update component list
  const query = '[name="nue:components"]'
  $(query).content = $(query, dom).content

  // forEach() does not work due to timing issues
  for (const script of $$('script[src]', dom)) {

    // modules are loaded only once by the browser
    await import(script.getAttribute('src'))
  }

  const css_paths = updateStyles(dom)

  loadCSS(css_paths, () => {
    const ignore_main = simpleDiff($('main'), $('main', dom))
    simpleDiff($('body'), $('body2', dom), ignore_main)

    // scroll
    const { hash } = location
    const el = hash && $(hash)
    scrollTo(0, el ? el.offsetTop - parseInt(getComputedStyle(el).scrollMarginTop) || 0 : 0)

    // route event
    dispatchEvent(new Event('route'))

    // route:app event
    const [_, app] = location.pathname.split('/')
    dispatchEvent(new Event(`route:${app || 'home'}`))

    setActive(path)
  })

}


// setup linking
export function onclick(root, fn) {
  root.addEventListener('click', e => {
    const el = e.target.closest('[href]')
    const path = el?.getAttribute('href')
    const target = el?.getAttribute('target')
    const name = path?.split('/')?.pop()?.split(/[#?]/)?.shift()

    // event ignore
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
      !path || path[0] == '#' || path?.includes('//') || path?.startsWith('mailto:') ||
      (name?.includes('.') && !name?.endsWith('.html')) || !!target) return

    // all good
    if (path != location.pathname) fn(el.pathname, el)
    e.preventDefault()

  })
}

function toRelative(path) {
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

      // set timeout needed @ nue docs area. TODO: remove this hack
      setTimeout(() => el.setAttribute(attrname, 'page'), 50)
    }
  })
}


// browser environment
const is_browser = typeof window == 'object'

if (is_browser) {

  // view transition fallback (Safari, Firefox) • caniuse.com/view-transitions
  if (!document.startViewTransition) {
    document.startViewTransition = (fn) => fn()
  }

  // Fix: window.onpopstate, event.state == null?
  // https://stackoverflow.com/questions/11092736/window-onpopstate-event-state-null
  history.pushState({ path: location.pathname }, 0)

  // autoroute / document clicks
  onclick(document, async (path, el) => {
    const img = $('img', el)
    if (img) img.style.viewTransitionName = 'active-image'

    document.startViewTransition(async () => {
      await loadPage(path)
    })
  })

  // initial active
  setActive(location.pathname)

  // back button
  addEventListener('popstate', e => {
    const { path, is_spa } = e.state || {}
    if (path && !is_spa) {
      const pos = scrollPos[path]

      document.startViewTransition(async () => {
        await loadPage(path, true)
        setTimeout(() => window.scrollTo(0, pos || 0), 10)
      })
    }
  })
}


/* -------- utilities ---------- */


// primitive DOM diffing
function simpleDiff(a, b, ignore_main) {
  a.classList.value = b.classList.value

  if (a.children.length == b.children.length) {
    ;[...a.children].forEach((el, i) => {
      if (!(ignore_main && el.tagName == 'MAIN')) updateBlock(el, b.children[i])
    })
    return true

  } else {
    a.innerHTML = b.innerHTML
  }
}

function updateBlock(a, b) {
  const orig = a.outerHTML.replace(' aria-current="page"', '')
  if (orig != b.outerHTML) a.replaceWith(b.cloneNode(true))
}


function updateStyles(dom) {
  // Inline CSS / development
  const orig = $$('link, style')
  const new_styles = swapStyles(orig, $$('link, style', dom))
  new_styles.forEach(style => $('head').appendChild(style))

  // inline style element
  updateProductionStyles(dom)

  // external CSS
  return new_styles.filter(el => el.tagName == 'link')
}


function hasStyle(sheet, sheets) {
  return sheets.find(el => el.getAttribute('href') == sheet.getAttribute('href'))
}


// disable / enable
function swapStyles(orig, styles) {
  orig.forEach((el, i) => el.disabled = !hasStyle(el, styles))
  return styles.filter(el => !hasStyle(el, orig))
}

function findPlainStyle(dom) {
  return $$('style', dom).find(el => !el.attributes.length)
}

// production: single inline style element without attributes
function updateProductionStyles(dom) {
  const plain = findPlainStyle()
  const new_plain = findPlainStyle(dom)

  if (plain) plain.replaceWith(new_plain)
  else if (new_plain) $('head').appendChild(new_plain)
}


const cache = {}

async function getHTML(path) {
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
