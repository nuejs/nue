
// MPA router

const is_browser = typeof window == 'object'

export async function loadPage(path) {
  dispatchEvent(new Event('before:route'))

  const dom = mkdom(await getHTML(path))

  // title
  document.title = $('title', dom)?.textContent

  // main / body
  const main = $('main')
  const main2 = $('main', dom)

  if (main && main2) {
    main.replaceWith(main2)
  } else {
    $('body').innerHTML = $('body2', dom).innerHTML
    $('body').classList = $('body2', dom).classList
  }

  // inline CSS
  const new_styles = swapStyles($$('style'), $$('style', dom))
  new_styles.forEach(style => $('head').appendChild(style))


  // stylesheets
  const paths = swapStyles($$('link'), $$('link', dom))

  loadCSS(paths, () => {
    scrollTo(0, 0)
    dispatchEvent(new Event('route'))
  })
}


// back button
addEventListener('popstate', e => {
  const { path, is_spa } = e.state || {}
  if (path) loadPage(path)
})


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

export function setSelected(path, className='selected') {
  const el = $(`[href="${path}"]`)
  $$('.' + className).forEach(el => el.classList.remove(className))
  el?.classList.add(className)
}


// Fix: window.onpopstate, event.state == null?
// https://stackoverflow.com/questions/11092736/window-onpopstate-event-state-null
is_browser && history.pushState({ path: location.pathname }, 0)


// autoroute / document clicks
is_browser && onclick(document, (path) => {
  loadPage(path)
  history.pushState({ path }, 0, path)
  setSelected(path)
})


/* -------- utilities ---------- */

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



