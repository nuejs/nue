
// exported
export function $(query, root=document) {
  return root.querySelector(query)
}

export function $$(query, root=document) {
  return [ ...root.querySelectorAll(query)]
}


// Router for multi-page applications

export async function loadPage(path, no_push) {
  dispatchEvent(new Event('before:route'))

  if (!no_push) history.pushState({ path }, 0, path)

  // DOM of the new page
  const dom = mkdom(await getHTML(path))

  // change title
  const title = $('title', dom)?.textContent
  if (title) document.title = title

  // update <meta name="nue:components"/>
  const query = '[name="nue:components"]'
  $(query).content = $(query, dom).content

  // forEach() does not work due to timing issues
  for (const script of $$('script[src]', dom)) {

    // modules are loaded only once by the browser
    await import(script.getAttribute('src'))
  }

  // Inline CSS / development
  const new_styles = swapStyles($$('style'), $$('style', dom))
  new_styles.forEach(style => $('head').appendChild(style))

  // external CSS
  const paths = swapStyles($$('link'), $$('link', dom))

  /* production (single style element) */
  const orig_style = findPlainStyle()
  const new_style = findPlainStyle(dom)

  if (orig_style) orig_style.replaceWith(new_style)
  else if (new_style) $('head').appendChild(new_style)


  // body class
  $('body').classList.value = $('body2', dom).classList.value || ''


  loadCSS(paths, () => {
    updateBody(dom)
    setActive(path)

    // scroll
    const { hash } = location
    const el = hash && $(hash)
    scrollTo(0, el ? el.offsetTop - parseInt(getComputedStyle(el).scrollMarginTop) || 0 : 0)

    // route event
    dispatchEvent(new Event('route'))
  })

}

function findPlainStyle(dom) {
  return $$('style', dom).find(el => !el.attributes.length)
}


// TODO: make a recursive diff to support for all custom layouts
function updateBody(dom) {

  ;['header', 'main', 'footer', 'nav'].forEach(function(query) {
    const a = $('body >' + query)
    const b = $('body2 >' + query, dom)
    const clone = b && b.cloneNode(true)

    // update
    if (a && b) {

      if (query == 'main') {
        updateMain(dom)

      } else {
        updateBlock(a, clone)
      }


    // remove original
    } else if (a) {
      a.remove()

    // add new one
    } else if (b) {
      if (query == 'header') $('body').prepend(clone)
      if (query == 'footer') $('body').append(clone)
      if (query == 'nav') $('body > header').after(clone)
    }
  })

}

// primitive DOM diffing
function updateBlock(a, clone) {
  const orig = a.outerHTML.replace(' aria-selected=""', '')
  const diff = orig != clone.outerHTML
  if (diff) a.replaceWith(clone)
}

// TODO: remove this hack
function updateMain(dom) {
  ;['article', 'aside:first-child', 'article + aside'].forEach(function(query, i) {
    const a = $('main >' + query)
    const b = $('main >' + query, dom)
    const clone = b && b.cloneNode(true)

    // update
    if (a && b) {
      updateBlock(a, clone)

    } else if (a) {
      a.remove()

    } else if (b) {
      if (!i) $('main').append(clone)
      if (i == 1) $('main').prepend(clone)
      if (i == 2) $('article').after(clone)
    }

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
        (name?.includes('.') && !name?.endsWith('.html')) || target == '_blank') return

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
    if (el.getAttribute('href') == path) el.setAttribute(attrname, '')
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
      await loadPage(path)
    })
  })

  // initial active
  setActive(location.pathname)

  // back button
  addEventListener('popstate', e => {
    const { path } = e.state || {}
    if (path) loadPage(path, true)
  })
}


/* -------- utilities ---------- */


function hasStyle(sheet, sheets) {

  return sheets.find(el => el.getAttribute('href') == sheet.getAttribute('href'))
}

function swapStyles(orig, styles) {

  // disable / enable
  orig.forEach((el, i) => {
    el.disabled = !hasStyle(el, styles)
  })


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
