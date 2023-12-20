
/* Builders for CSS, JS, and TS */

import { join, extname } from 'node:path'

export async function getBuilder(is_esbuild) {
  try {
    return is_esbuild ? await import('esbuild') : Bun
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

const not_found = {}

export async function findModule(name, path='') {
  if (not_found[name]) return

  const attempts = [
    join(process.cwd(), 'node_modules', name, path),
    join(process.cwd(), '..', 'node_modules', name, path),
    name,
  ]

  for (const path of attempts) {
    try {
      return await import(path)
    } catch {}
  }

  not_found[name] = true
}


export async function buildCSS({ css, ext, minify }) {

  // stylus
  if (ext == '.styl') {
    const stylus = await findModule('stylus')
    if (!stylus) throw 'Module not found: "stylus"'

    try {
      process.stdout.write('🖌️')
      return stylus.render(css, { compress: minify })

    } catch({ message, stack }) {
      const [l, col] = message.slice(7, message.indexOf('\n')).split(':')
      throw {
        title: 'Stylus syntax error',
        text: stack.split('\n')[0],
        lineText: css.split('\n')[l -1],
        column: 1 * col,
        line: 1 * l,
      }
    }
  }

  // Nue CSS (not public yet)
  if (ext == '.style') {
    const nuecss = await import('nuecss')
    return nuecss.default(css, { minify })
  }

  const mod = await findModule('lightningcss', 'node/index.mjs')

  // Standard CSS
  if (!mod) return minify ? minifyCSS(css) : css

  // Lightning CSS
  process.stdout.write('⚡️')

  try {
    const include = mod.Features.Colors | mod.Features.Nesting
    return mod.transform({ code: Buffer.from(css), include, minify }).code?.toString()

  } catch({ source, loc, data}) {
    throw {
      title: 'CSS syntax error',
      lineText: source.split('\n')[loc.line -1],
      text: data.type,
      ...loc
    }
  }
}


// temporary hack, until Bun does this natively
export function minifyCSS(code) {
  return code.replace(/\s+/g, ' ')
    .replace(/ ?([:{}]) /g, '$1')
    // .replace(/\**?(.|\n)*?\*\//g, '')
    .trim()
}