
import { mkdir, rm, readdir } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildJS } from './site.js'
import { version } from './help.js'


export async function init({ dist, minify, force }) {
  const outdir = await initDir(dist, force)
  if (!outdir) return

  await deployPackage('nuestate/src/state.js', outdir, minify)
  await deployPackage('nuedom/src/nue.js', outdir, minify)
  await deployClient(outdir, minify)
  return outdir
}

export async function initDir(dist, force) {
  const outdir = join(process.cwd(), dist, '@nue')

  const ver = Bun.file(join(outdir, version))
  if (!force && await ver.exists()) return

  // recreate direcotry
  await rm(outdir, { recursive: true, force: true })
  await mkdir(outdir, { recursive: true })

  // write version file
  await ver.writer().end()
  return outdir
}


export async function deployClient(outdir, minify) {
  const dir = join(import.meta.dir, '../client')
  const names = await readdir(dir)

  for (const name of names) {
    const path = join(dir, name)
    const ext = extname(name)

    if (minify && ext == '.js') {
      await buildJS(path, outdir, true)

    } else if (ext) {
      await Bun.write(join(outdir, name), Bun.file(path))
    }
  }
}

export async function deployPackage(relativePath, outdir, minify) {
  const path = fileURLToPath(import.meta.resolve(relativePath))

  return await Bun.build({
    entrypoints: [path],
    target: 'browser',
    minify,
    outdir
  })
}



