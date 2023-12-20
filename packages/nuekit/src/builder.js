
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

// convert Lightning errors to Nue errors to be displayed on client
function parseCSSError({ source, loc, data}) {
  return {
    title: 'CSS syntax error',
    text: `Type: ${data.type}`,
    lineText: source.split('\n')[loc.line -1],
    ...loc
  }
}


export async function buildCSS({ css, ext, minify }) {

  // not in use currently
  if (ext == '.style') {
    const nuecss = await import('nuecss')
    return nuecss.default(css, { minify })
  }

  const mod = await findModule('lightningcss', 'node/index.mjs')
  if (!mod) return minify ? minifyCSS(css) : css

  // Lightning CSS
  process.stdout.write('⚡️')

  try {
    const include = mod.Features.Colors | mod.Features.Nesting
    return mod.transform({ code: Buffer.from(css), include, minify }).code?.toString()

  } catch(e) {
    throw parseCSSError(e)
  }
}


// temporary hack, until Bun does this natively
export function minifyCSS(code) {
  return code.replace(/\s+/g, ' ')
    .replace(/ ?([:{}]) /g, '$1')
    // .replace(/\**?(.|\n)*?\*\//g, '')
    .trim()
}
