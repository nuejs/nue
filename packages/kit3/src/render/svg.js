
import { parseYAMLArray } from 'nueyaml'

import { renderNue } from 'nuedom'
import { elem } from 'nuemark'

import { inlineCSS } from './head'
import { trim } from './page'


// opts: { hmr, fonts }
export async function renderSVG(asset, opts={}) {
  const { root } = await asset.parse()
  const hmr = opts.hmr != null
  const fonts = await renderFonts(opts.fonts, hmr)
  const deps = await asset.components()
  const data = await asset.data()

  transform(root)

  const styles = getStyles(await asset.assets(), parseYAMLArray('tmp: ' + root.meta?.css))

  if (hmr) {
    const { base } = asset
    const body = renderNue(root, { deps, data })
    return renderHMR({ body, base, fonts, styles })

  } else {
    const css = [...fonts, await inlineCSS(styles)]

    if (css[0]) {
      const kids = root.children ??= []
      kids.unshift({ tag: 'style', children: [{ text: `<![CDATA[${css.join('\n')}]]>` }] })
    }

    return renderNue(root, { deps, data })
  }
}

export function getStyles(assets, patterns) {
  if (!patterns?.length) return []

  return assets.filter(asset =>
    asset.is_css && patterns.some(match => asset.path.includes(match))
  )
}

export function renderHMR({ body, base, fonts, styles }) {
  const links = styles.map(file => {
    return elem('link', { rel: 'stylesheet', href: `${file.url}` })
  })

  return trim(`
    <!doctype html>
    <html>
      <head>
        <title>${base} (dev mode)</title>
        <style>
        ${ fonts.join('\n') }
        body { margin: 0 }
        </style>

        ${ links.join('\n')}
        <script type="module" src="/@nue/hmr.js"></script>
      </head>

      <body>${body}</body>
    </html>
  `)
}


export async function renderFonts(conf, external) {
  if (!conf) return []
  const fn = external ? renderFont : renderInlineFont
  const promises = Object.entries(conf).map(([name, path]) => fn(name, path))

  try {
    return await Promise.all(promises)
  } catch(e) {
    console.error('Font file not found', e.path)
    return []
  }
}

function renderFont(name, path) {
  if (!path.startsWith('data') && path[0] != '/') path = '/' + path
  return `@font-face { font-family: '${name}'; src: url('${path}')}`
}

async function renderInlineFont(name, path) {
  const buffer = await Bun.file(path).arrayBuffer()
  const data = 'data:font/woff2;base64,' + Buffer.from(buffer).toString('base64')
  return renderFont(name, data)
}


/*** SVG transformations ***/
function transform(svg) {
  pushAttr(svg, 'xmlns', 'http://www.w3.org/2000/svg')
  pushViewport(svg)
  svg.children?.forEach(el => {
    if (el.tag == 'html') convertHTMLTag(el)
  })
}


function pushAttr(svg, name, val) {
  const attr = svg.attr ??= []
  if (!attr.find(el => el.name == name)) {
    attr.push({ name, val })
  }
}

function pushViewport(svg) {
  const { attr=[] } = svg
  const find = (name) => attr.find(el => el.name == name)
  const box = find('viewBox')
  const w = find('width')
  const h = find('height')
  if (!box && w && h) attr.push({ name: 'viewBox', val: `0 0 ${w.val} ${h.val}` })
}

export function convertHTMLTag(tag) {
  tag.tag = 'foreignObject'

  Object.entries({ x: 0, y: 0, width: '100%', height: '100%'}).forEach(([name, val]) => {
    pushAttr(tag, name, val)
  })

  tag.children?.forEach(el => pushAttr(el, 'xmlns', 'http://www.w3.org/1999/xhtml'))
  return tag

}



