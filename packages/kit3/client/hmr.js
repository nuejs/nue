

function connect() {
  const href = location.href.split('#')[0]
  const ws = new WebSocket(href.replace('http:', 'ws:'))

  ws.onmessage = async function(e) {
    const asset = JSON.parse(e.data)
    const url = asset.is_md && getURL(asset)

    return url ? location.href = url
      : asset.css ? reloadCSS(asset)
      : asset.content ? await reloadContent(asset)
      : asset.is_dhtml ? await reloadComponents(asset)
      : asset.is_js || asset.is_ts ? location.reload()
      : asset.is_remove ? removeAsset(asset)
      : console.log('HMR void', asset)
  }

  // reconnect
  ws.onclose = function() {
    console.log('HMR reconnecting...')
    setTimeout(connect, 3000)
  }

  ws.onerror = function() {
    ws.close()
  }

  // addEventListener('route', () =>  ws.send(location.href))
}

connect()


function getURL(asset) {
  const { chain, url } = asset
  const site = chain.at(-1)
  const host = (site == '@base' ? '' : site + '.') + 'localhost'

  if (host == location.hostname) {
    return url != location.pathname ? url : null

  } else if (!document.hidden) {
    return `http://${ host }:${ location.port }${ url }`
  }

}


function $(query, root=document) {
  return root.querySelector(query)
}

async function reloadContent(asset) {
  const { url } = asset

  // domdiff
  const { mountAll } = await import('./mount.js')
  const { domdiff } = await import('/@nue/nue.js')

  const { title, body } = parsePage(asset.content)
  if (title != document.title) document.title = title
  const lib = asset.ast?.lib

  // focused HMR
  if (lib?.length == 1) {
    const { tag } = lib[0]
    domdiff($(tag), body.querySelector(tag))

  // diff everything
  } else {
    domdiff($('body'), body)
  }

  await mountAll()

  window.ignoreClick = true
}

function removeAsset(asset) {
  if (asset.is_css) $(`[href="${asset.url}"]`)?.remove()
}

function reloadSVG(html) {
  const svg = html.slice(html.indexOf('<svg '), html.indexOf('</svg>') + 6)
  document.body.innerHTML = svg
}

function reloadCSS(asset) {
  const { url, css } = asset

  const orig = $(`[href="${url}"]`)
  const style = createStyle(url, css)

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

function createStyle(url, css) {
  const el = document.createElement('style')
  el.setAttribute('href', url)
  el.innerHTML = css
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


/*

async function handleError(asset) {
  const { showError } = await import('./error.js')
  const { error, path } = asset
  showError({ ...error, path })
}


let reload_count = 0

function reloadVisual(asset) {

  // svg HMR mode
  if (location.pathname.endsWith('.svg')) return reloadSVG(asset.content)

  // <img> and <object> tags
  const { url } = asset

  function reload(el, attr) {
    if (el) el[attr] = `${url}?${reload_count++}`
  }

  reload($(`object[data*='${url}']`), 'data')
  reload($(`img[src*='${url}']`), 'src')
}
*/