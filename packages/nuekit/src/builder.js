/* Builders for CSS, JS, and TS */

import { promises as fs } from 'node:fs'
import { join } from 'node:path'

import { resolve } from 'import-meta-resolve'
import { Features, bundleAsync } from 'lightningcss'

let jsBuilder
export async function getBuilder(is_esbuild) {
  if (jsBuilder) return jsBuilder

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
  let ret

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

  try {
    ret = await builder.build(opts)

  } catch (e) { ret = e }

  // console.info(ret)
  const error = parseError(ret)
  if (error) throw error
}

export function parseError(buildResult) {
  const { logs = [], errors = [] } = buildResult
  let error

  // Bun
  if (logs.length) {
    const [err] = logs
    error = { text: err.message, ...err.position }
  }

  // esbuild
  if (errors.length) {
    const [err] = errors
    error = { text: err.text, ...err.location }
  }

  if (error) {
    error.title = error.text.includes('resolve') ? 'Import error' : 'Syntax error'
    delete error.file
    return error
  }

}

export async function lightningCSS(filename, minify, opts = {}) {
  let include = Features.Colors
  if (opts.native_css_nesting) include |= Features.Nesting

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
