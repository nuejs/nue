
import { mountAll } from './mount.js'

const sse = new EventSource(location.origin)

const $ = (query, root=document) => root.querySelector(query)


sse.onmessage = function(e) {
  const data = e.data ? JSON.parse(e.data) : {}
  const { error, html, css, dir, url, path } = data

  // big change -> full reload
  if (data.site_updated) return location.reload()

  // error
  if (error) {
    Object.assign(error, { path, ext: data.ext?.slice(1) })
    import('./error.js').then(el => el.showError(error))
  } else {
    $('.nuerr')?.remove()
  }

  // content
  if (html) {
    if (data.is_md && location.pathname != url) location.href = url
    else patch(html)
  }

  // component
  if (data.is_nue) remount('/' + data.path.replace('.nue', '.js'))

  // styling (inline && stylesheets)
  if (css) {
    const href = `/${dir}${dir ? '/' : ''}${data.name}.css`
    const orig = $(`[href="${href}"]`)
    const style = createStyle(href, css)

    if (orig) orig.replaceWith(style)
    else document.head.appendChild(style)
  }

  // remove css
  if (data.remove && data.ext == '.css') {
    const orig = $(`[href="/${data.path}"]`)
    if (orig) orig.remove()
  }
}


function createStyle(href, css) {
  const el = document.createElement('style')
  el.setAttribute('href', href)
  el.innerHTML = css
  return el
}


function deserialize(form, formdata) {
  for (const [key, val] of formdata.entries()) {
    const el = form.elements[key]
    if (el.type == 'checkbox') el.checked = !!val
    else el.value = val
  }
}


async function remount(path) {

  // save form/dialog state
  const data = [...document.forms].map(form => new FormData(form))
  let dialog = $('dialog[open]')

  // mount all
  await mountAll(path)

  // restore form data
  data.forEach((formdata, i) => deserialize(document.forms[i], formdata))

  // dialog found -> re-open
  dialog = window[dialog?.id]
  if (dialog) { dialog.close(); dialog.showModal() }
}


function parsePage(html) {
  const root = document.createElement('html')
  root.innerHTML = html
  return { title: $('title', root)?.textContent, body: $('body', root) }
}

async function patch(html) {
  const { DiffDOM } = await import('/@nue/diffdom.js')
  const Diff = new DiffDOM() // { postDiffApply: scrollTo }
  const old_body = $('body')
  const { title, body } = parsePage(html)

  if (title) document.title = title

  const diff = Diff.diff(old_body, body)
  Diff.apply(old_body, diff)
  await mountAll()

}

/*

// patch triggers multiple events so it's impossible to know which one was the most recent update

function inViewport(el) {
  const rect = el.getBoundingClientRect()
  return rect.top > 0 && rect.left > 0 && rect.bottom < innerHeight && rect.right < innerWidth
}

function scrollTo({ diff, node }) {
  const p = node?.parentElement
  const el = node?.closest ? node : p
  if (!inViewport(el)) el.scrollIntoView({ behavior: 'smooth' })
}
*/
