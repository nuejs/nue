
import { renderNue } from 'nuedom'
import { renderInline } from 'nuemark'

const globals = { markdown: renderInline }

export function renderContent(content, { head=[], comps=[], data={}, conf={} }) {
  const attr = getAttr(data)
  const { scope } = data
  const { max_class_names } = conf.design || {}

  function slot(name) {
    if (data[name] === false) return ''
    const comp = comps.find(el => el.is ? el.is == name : el.tag == name)
    return comp ? renderNue(comp, { data, deps: comps, globals, max_class_names }) : ''
  }

  const article = scope == 'article' ? content : `
    <article>
      ${ slot('pagehead') }
      ${ content }
      ${ slot('pagefoot') }
    </article>
  `

  const main = scope == 'main' ? content : `
    <main>
      ${ slot('aside') }
      ${ article }
      ${ slot('beside') }
    </main>
  `


  const body = scope == 'body' ? content : `
    <body${attr.class}>
      ${ slot('banner') }
      ${ slot('header') }
      ${ slot('subheader') }
      ${ main }
      ${ slot('footer') }
      ${ slot('bottom') }
    </body>
  `

  return `
    <!doctype html>

    <html lang="${attr.language}"${attr.dir}>
      <head>
        ${ head }
        ${ slot('head') }
      </head>
      ${body}
    </html>
  `
}


function getAttr(data) {
  const { language = 'en-US', direction } = data
  return {
    class: data.class ? ` class="${data.class}"` : '',
    dir: direction ? ` dir="${direction}"` : '',
    language,
  }
}






