
import { join } from 'node:path'
import { compileNue } from 'nuedom'
import { fileURLToPath } from 'node:url'
import { minifyCSS } from '../tools/css'
import { renderPage } from './page'

export async function renderAsset(asset, chain, assets, is_prod) {
  const content = asset.is_md ? await renderPage(asset, chain, assets, is_prod)
    : asset.is_js && is_prod || asset.is_ts ? await compileJS(filepath, is_prod)
    : asset.is_css && is_prod ? minifyCSS(await asset.text())
    : asset.is_nue ? await readNueAsset(asset.name, is_prod)
    : asset.is_html ? compileNue(await asset.parse())
    : await asset.text()

  return { content, type: await getContentType(asset) }
}

const MIME = {
  js: 'application/javascript',
  html: 'text/html; charset=utf-8',
}

async function getContentType(asset) {
  if (asset.is_html) {
    const { is_dhtml } = await asset.parse()
    return is_dhtml ? MIME.js : MIME.html
  }
  return asset.is_ts ? MIME.js
    : asset.is_md ? MIME.html
    : (MIME[asset.type] || asset.file?.type)
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

function resolvePackage(path) {
  return fileURLToPath(import.meta.resolve(path))
}

async function readNueAsset(name, is_prod) {
  const path = name == 'nue.js' ? resolvePackage('nuedom/src/nue.js')
    : name == 'state.js' ? resolvePackage('nuestate/src/state.js')
    : join(import.meta.dir, '../../client', name)

  return await compileJS(path, is_prod, name == 'nue.js')
}




