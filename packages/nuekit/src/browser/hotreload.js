import { mountAll } from './mount.js'

const sse = new EventSource(location.origin)

const $$ = (query, root = document) => [...root.querySelectorAll(query)]
const $ = (query, root = document) => root.querySelector(query)


sse.onmessage = async function(e) {
  const data = e.data ? JSON.parse(e.data) : {}
  const { error, html, css, dir, url, path } = data

  // big change -> full reload
  if (data.site_updated) return location.reload()

  // error
  $('.nuerr')?.remove()

  if (error) {
    Object.assign(error, { path, ext: data.ext?.slice(1) })
    import('./error.js').then(el => el.showError(error))
  }

  // content
  if (html) {
    const uri = url.replace('/index.html', '/')
    if (data.is_md && location.pathname != uri) location.href = uri
    else {
      await patch(html)
      dispatchEvent(new Event('reload'))
    }
  }

  // client-side component
  if (data.is_dhtml || data.is_htm) {
    remount('/' + data.path.replace(data.ext, '.js'))
    dispatchEvent(new Event('hmr'))
  }

  // styling (inline && stylesheets)
  if (css) {
    const href = `/${dir}${dir ? '/' : ''}${data.name}.css`
    const orig = $(`[href="${href}"]`)
    const style = createStyle(href, css)

    if (orig) orig.replaceWith(style)
    else if (canAdd(data)) document.head.appendChild(style)
  }

  // remove css (note: is_css not available in remove events)
  if (data.remove && data.ext == '.css') {
    const orig = $(`[href="/${data.path}"]`)
    if (orig) orig.remove()
  }
}

function canAdd({ dir, name, basedir }) {

  // exclude
  if (contains(getMeta('exclude'), name)) return false

  // global
  if (getMeta('globals')?.includes(dir)) return true

  // library
  if (getMeta('libs')?.includes(dir) && contains(getMeta('include'), name)) return true

  // current app
  const appdir = location.pathname.split('/')[1]
  return appdir == basedir
}

function getMeta(key) {
  return $(`[name="nue:${key}"]`)?.getAttribute('content')?.split(' ')
}

function contains(matches, name) {
  return matches?.find(match => name.includes(match))
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
  const popover = $('[popover]')
  const pid = popover?.checkVisibility() && popover.id
  const dialog = $('dialog[open]')

  // mount all
  await mountAll(path)

  // restore form data
  data.forEach((formdata, i) => deserialize(document.forms[i], formdata))

  // re-open popover
  if (pid) {
    const el = window[pid]
    el?.showPopover()
  }

  // re-open dialog
  if (dialog) {
    const el = window[dialog.id]
    if (el) { el.close(); el.showModal() }
  }

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


