
/* Builders for CSS, JS, and TS */

import { Features, transform } from 'lightningcss'
import { join, extname } from 'node:path'
import { resolve } from 'import-meta-resolve'


export async function getBuilder(is_esbuild) {
  const actual_cwd = process.env.ACTUAL_CWD || process.cwd()
  try {
    return is_esbuild ? await import(resolve('esbuild', `file://${actual_cwd}/`)) : Bun
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
    entryPoints: [ args.path ],
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
  const { logs=[], errors=[] } = buildResult
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

export async function lightningCSS(css, minify, opts={}) {
  let include = Features.Colors
  if (opts.native_css_nesting) include |= Features.Nesting

  try {
    return transform({ code: Buffer.from(css), include, minify }).code?.toString()

  } catch({ source, loc, data}) {
    throw {
      title: 'CSS syntax error',
      lineText: source.split(/\r\n|\r|\n/)[loc.line -1],
      text: data.type,
      ...loc
    }
  }
}
