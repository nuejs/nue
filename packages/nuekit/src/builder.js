/* Builders for CSS, JS, and TS */

import { promises as fs } from 'node:fs'
import { join } from 'node:path'

import { resolve } from 'import-meta-resolve'
import { Features, bundleAsync } from 'lightningcss'

// don't reuse saved builder when in test mode
const isTest = process.env.NODE_ENV == 'test'

let jsBuilder
export async function getBuilder(is_esbuild) {
  if (!isTest && jsBuilder) return jsBuilder

  try {
    return jsBuilder = is_esbuild ? await import(resolve('esbuild', `file://${process.cwd()}/`)) : Bun
  } catch {
    throw 'Bundler not found. Please use Bun or install esbuild'
  }
}

export async function buildJS(args) {
  const { outdir, toname, minify, bundle } = args
  const is_esbuild = args.esbuild || !process.isBun
  const builder = await getBuilder(is_esbuild)

  const opts = {
    external: bundle ? ['../@nue/*', '/@nue/*'] : is_esbuild ? undefined : ['*'],
    entryPoints: [args.path],
    format: 'esm',
    outdir,
    bundle,
    minify,
  }

  if (args.silent) opts.logLevel = 'silent'

  if (toname) {
    if (is_esbuild) {
      delete opts.outdir
      opts.outfile = join(outdir, toname)
    } else {
      opts.naming = toname
    }
  }

  // make bun always throw on build error
  if (!is_esbuild) opts.throw = true

  try {
    await builder.build(opts)

  } catch ({ errors }) {
    const [err] = errors
    const error = { text: err.message || err.text, ...(err.location || err.position) }
    error.title = error.text.includes('resolve') ? 'Import error' : 'Syntax error'
    delete error.file
    throw error
  }
}

export async function lightningCSS(filename, minify, opts = {}) {
  let include = Features.Colors
  if (!opts.native_css_nesting) include |= Features.Nesting

  try {
    return (await bundleAsync({ filename, include, minify })).code?.toString()
  } catch ({ fileName, loc, data }) {
    throw {
      title: 'CSS syntax error',
      lineText: (await fs.readFile(fileName, 'utf-8')).split(/\r\n|\r|\n/)[loc.line - 1],
      text: data.type,
      ...loc
    }
  }
}
