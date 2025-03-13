/* Builders for CSS, JS, and TS */

import { promises as fs } from 'node:fs'
import { join } from 'node:path'

import { resolve } from 'import-meta-resolve'

// don't reuse saved builder when in test mode
const isTest = process.env.NODE_ENV == 'test'

let jsBuilder
export async function getJsBuilder(is_esbuild) {
  if (!isTest && jsBuilder) return jsBuilder

  try {
    return jsBuilder = is_esbuild ? await import(resolve('esbuild', `file://${process.cwd()}/`)) : Bun
  } catch {
    throw 'JS bundler not found. Please use Bun or install esbuild'
  }
}

let cssBuilder
export async function getCssBuilder(is_lcss) {
  if (!isTest && cssBuilder) return cssBuilder

  try {
    cssBuilder = is_lcss ? await import(resolve('lightningcss', `file://${process.cwd()}/`)) : Bun
    if (!is_lcss) {
      const v = Bun.version.split('.').map(i => parseInt(i))
      if (!(v[0] >= 1 && v[1] >= 2)) throw new Error('Bun version too low')
    }
    return cssBuilder
  } catch {
    console.error('CSS bundler not found. Please use Bun >=1.2 or install lightningcss. Falling back to copy CSS.')
  }
}

export async function buildJS(args) {
  const { outdir, toname, minify, bundle } = args
  const is_esbuild = args.esbuild || !process.isBun
  const builder = await getJsBuilder(is_esbuild)

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
    const error = { text: err.message || err.text, ...(err.position || err.location) }
    error.title = error.text.includes('resolve') ? 'Import error' : 'Syntax error'
    delete error.file
    throw error
  }
}

export async function buildCSS(filename, minify, opts = {}, lcss) {
  const is_lcss = lcss || !process.isBun
  const builder = await getCssBuilder(is_lcss)
  if (!builder) return

  let include
  if (is_lcss) {
    include = builder.Features.Colors
    if (opts.native_css_nesting) include |= builder.Features.Nesting
  }

  try {
    if (is_lcss) return (await builder.bundleAsync({
      filename,
      include,
      minify,
    })).code.toString()

    else return await (await builder.build({
      entrypoints: [filename],
      minify,
      throw: true,
      experimentalCss: true,
      plugins: [{
        name: 'mark non-css files as external',
        setup(build) {
          build.onResolve({ filter: /.*/, namespace: 'file' }, args => {
            // Mark non-css files external. Might need some more handling later on?
            if (args.kind === 'internal') return { ...args, external: true }
          })
        },
      }],
    })).outputs[0].text()

  } catch (e) {
    // bun aggregate error
    const [err] = e.errors || [e]

    throw {
      title: 'CSS syntax error',
      lineText: err?.position?.lineText || (err.fileName && (await fs.readFile(err.fileName, 'utf-8')).split(/\r?\n/)[err.loc.line - 1]),
      text: err?.message || err?.data?.type,
      ...(err?.position || err?.loc),
    }
  }
}
