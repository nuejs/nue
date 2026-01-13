
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { compileNue } from 'nuedom'

import { fileURLToPath } from 'node:url'

import { generateSitemap, generateFeed } from './feed'
import { minifyCSS } from '../tools/css'
import { renderPage } from './page'
import { renderHTML } from './html'

export const MIME = {
  xml: 'application/xml; charset=utf-8',
  html: 'text/html; charset=utf-8',
  js: 'application/javascript',
}


export async function renderAsset(asset, { chain, assets, as_js, is_prod }) {
  if (!asset || asset?.bytes) return asset

  if (asset.is_html) {
    const ast = await asset.parse()
    return as_js || (ast.is_lib && ast.is_dhtml) ?
      { content: compileNue(await asset.parse()), type: MIME.js } :
      { content: await renderHTML(asset, chain, assets, is_prod), type: MIME.html }
  }

  const content = asset.is_md ? await renderPage(asset, chain, assets, is_prod)
    : asset.is_js ? (is_prod || asset.is_ts ? await minifyJS(await asset.text()) : asset.file)
    : asset.is_css ? (is_prod ? minifyCSS(await asset.text()) : asset.file)
    : asset.is_nue ? await readNueAsset(asset.name, is_prod)
    : asset.is_xml ? await asset.read()
    : asset.bytes ? asset
    : asset.file

  // chain data goes to hmr.js (client)
  return { content, type: getMimeType(asset), chain }
}


export async function compileJS(path, minify, bundle) {
  const result = await Bun.build({
    external: bundle ? undefined : ['*'],
    entrypoints: [path],
    target: 'browser',
    minify
  })

  const [ js ] = result.outputs
  return await js.text()
}

export async function minifyJS(code) {
  const path = join(tmpdir(), `temp-${Date.now()}.js`)
  const tmp = Bun.file(path)
  await tmp.write(code)

  const result = await Bun.build({
    entrypoints: [path],
    external: ['*'],
    minify: true
  })

  await tmp.delete()
  return await result.outputs[0].text()
}

function resolvePackage(path) {
  return fileURLToPath(import.meta.resolve(path))
}

export async function readNueAsset(name, is_prod) {
  const path = name == 'nue.js' ? resolvePackage('nuedom/src/nue.js')
    : name == 'state.js' ? resolvePackage('nuestate/src/state.js')
    : join(import.meta.dir, '../../client', name)

  return await compileJS(path, is_prod, name == 'nue.js')
}

function getMimeType(asset) {
  return asset.is_ts ? MIME.js : asset.is_md ? MIME.html : (MIME[asset.type] || asset.file?.type)
}



