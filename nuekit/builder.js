
import { extname } from 'node:path'

export async function getBuilder(use_esbuild) {
  return process.isBun && !use_esbuild ? Bun : await import('esbuild')
}

export async function buildJS(opts) {
  const { path, outdir, minify, bundle, esbuild } = opts
  const builder = await getBuilder(esbuild)
  let ret

  try {
    ret = await builder.build({
      external: bundle ? ['../@nue/*', '/@nue/*'] : esbuild || !process.isBun ? undefined : ['*'],
      entryPoints: [ './' + path ],
      outdir, bundle, minify,

      // esbuild
      logLevel: 'silent',
      format: 'esm',
    })

  } catch (e) { ret = e }

  const error = parseError(ret)
  if (error) throw error
  // console.log('Built', path)
}

export async function minifyJS(path, outdir) {
  return await buildJS({ path, outdir, minify: true })
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

// temporary hack, until Bun does this natively
export function minifyCSS(code) {
  return code.replace(/\s+/g, ' ')
    .replace(/ ?([:{}]) /g, '$1')
    // .replace(/\**?(.|\n)*?\*\//g, '')
    .trim()
}