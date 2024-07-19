
// exported
export function $(query, root=document) {
  return root.querySelector(query)
}

export function $$(query, root=document) {
  return [ ...root.querySelectorAll(query)]
}


// Router for multi-page applications

export async function loadPage(path) {
  dispatchEvent(new Event('before:route'))

  // DOM of the new page
  const dom = mkdom(await getHTML(path))

  // change title
  document.title = $('title', dom)?.textContent

  // update <meta name="nue:components"/>
  const query = '[name="nue:components"]'
  $(query).content = $(query, dom).content

  // scripts
  $$('script[src]', dom).forEach(async script => {
    await import(script.getAttribute('src'))
  })

  // inline CSS
  const new_styles = swapStyles($$('style'), $$('style', dom))
  new_styles.forEach(style => $('head').appendChild(style))

  // body class
  $('body').classList.value = $('body2', dom).classList.value || ''

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

  ;['header', 'main', 'footer', 'header + :not(main)'].forEach(function(query, i) {
    const a = $('body >' + query)
    const b = $('body2 >' + query, dom)
    const clone = b && b.cloneNode(true)

    // update
    if (a && b) {

      // primitive DOM diffing
      if (a.outerHTML != b.outerHTML) a.replaceWith(clone)

    // remove original
    } else if (a) {
      a.remove()

    // add new one
    } else if (b) {
      if (i == 0) document.body.prepend(clone)
      if (i == 2) document.body.append(clone)
      if (i == 3) $('body > header').after(clone)
    }
  })

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

// developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected
export function setActive(path, attrname='aria-selected') {

  // remove old selections
  $$(`[${attrname}]`).forEach(el => el.removeAttribute(attrname))

  // add new ones
  $$('a').forEach(el => {
    if (el.href.endsWith(path)) el.setAttribute(attrname, '')
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
  onclick(document, async path => {
    document.startViewTransition(async function() {
      history.pushState({ path }, 0, path)
      await loadPage(path)
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

addEventListener("DOMContentLoaded", () => {
  dispatchEvent(new Event('route'))
})



/* -------- utilities ---------- */


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
  let html = cache[path]
  if (html) return html

  const resp = await fetch(path)
  html = await resp.text()

  if (resp.status == 404 && html?.trim()[0] != '<') {
    $('article').innerHTML = '<h1>Page not found</h1>'
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
