
//
const server = new EventSource(
  location.origin + '/hmr?url=' + encodeURIComponent(location.pathname)
)

let reload_count = 0

/*
  {
    dir: '',
    base: 'index.md',
    ext: '.md',
    name: 'index',
    path: 'index.md',
    type: 'md',
    url: '/',
    is_md: true,
    rootpath: 'index.md',
    content: '...'
  }
*/

server.onmessage = async function(e) {
  const asset = JSON.parse(e.data)

  return asset.error ? await handleError(asset)
    : asset.is_dhtml ? await reloadComponents(asset)
    : asset.is_md ? await reloadContent(asset)
    : asset.is_css ? reloadCSS(asset)
    : asset.is_svg || asset.is_html_page ? reloadVisual(asset)

    : asset.is_html ? location.reload() // server layout
    : asset.is_yaml ? location.reload()
    : null
}


async function handleError(asset) {
  const { showError } = await import('./error.js')
  const { error, path } = asset
  showError({ ...error, path })
}

async function reloadContent(asset) {
  const { url } = asset

  if (url != location.pathname) return location.href = url

  // domdiff
  const { mountAll } = await import('./mount.js')
  const { domdiff } = await import('nue')

  const { title, body } = parsePage(asset.content)
  if (title) document.title = title
  domdiff($('body'), body)
  await mountAll()
}


function reloadVisual(asset) {
  const { url } = asset

  function reload(el, attr) {
    if (el) el[attr] = `${url}?${reload_count++}`
  }

  reload($(`object[data*='${url}']`), 'data')
  reload($(`img[src*='${url}']`), 'src')
}

function reloadCSS(asset) {
  const { path } = asset
  const orig = $(`[href="${path}"]`)
  const style = createStyle(path, asset.content)

  if (orig) orig.replaceWith(style)
  else document.head.appendChild(style)
}

async function reloadComponents(asset) {
  const { mountAll } = await import('./mount.js')
  const state = saveState()
  await mountAll(asset.path)
  restoreState(state)
}


/***** helper functions *****/

function createStyle(path, content) {
  const el = document.createElement('style')
  el.setAttribute('href', path)
  el.innerHTML = content
  return el
}

// state before remounting
function saveState() {
  const formdata = [...document.forms].map(form => new FormData(form))
  const el = $('[popover]')
  const popover = el?.checkVisibility() && el.id
  const dialog = $('dialog[open]')?.id
  return { formdata, popover, dialog }
}

function restoreState({ formdata, popover, dialog }) {
  formdata.forEach((data, i) => deserialize(document.forms[i], data))

  // re-open popover
  if (popover) window[popover]?.showPopover()

  // re-open dialog
  if (dialog) {
    const el = window[dialog]
    if (el) { el.close(); el.showModal() }
  }
}

function deserialize(form, data) {
  for (const [key, val] of data.entries()) {
    const el = form.elements[key]
    if (el.type == 'checkbox') el.checked = !!val
    else el.value = val
  }
}

function parsePage(html) {
  const root = document.createElement('html')
  root.innerHTML = html
  return { title: $('title', root)?.textContent, body: $('body', root) }
}

function $(query, root=document) {
  return root.querySelector(query)
}
