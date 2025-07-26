
import { mkdir, rm, readdir } from 'node:fs/promises'
import { join, extname } from 'node:path'

import { version } from './help.js'


export async function init({ dist, is_prod, force }) {
  const to = await initDir(dist, force)

  await deployPackage('nuedom/mount', { to, is_prod, name: 'nue'})
  await deployPackage('nuestate/src/state', { to, is_prod })
  await deployClient(to, is_prod)
}

export async function initDir(dist, force) {
  const to = join(process.cwd(), dist, '@nue')

  const ver = Bun.file(join(to, `.v${version}`))
  if (!force || await file.exists()) return

  // recreate direcotry
  await rm(to, { recursive: true, force: true })
  await mkdir(to, { recursive: true })
  await ver.writer().end()
  return to
}


export async function deployClient(to, is_prod) {
  const dir = join(import.meta.dir, '../client')
  const names = await readdir(dir)

  for (const name of names) {
    const path = join(dir, name)
    const ext = extname(name)

    if (is_prod && ext == '.js') {
      await minifyJS(path, dir)
    } else if (ext) {
      const file = Bun.file(path)
      await Bun.write(join(to, name), file)
    }
  }
}

async function minifyJS(path, outdir) {

  const ret = await Bun.build({
    entrypoints: [path],
    target: 'browser',
    external: ['*'],
    minify: true,
    outdir,
  })
  console.info(ret)
}


export function resolvePath(npm_path) {
  const [npm_name, ...parts] = npm_path.split('/')
  const module_path = dirname(fileURLToPath(import.meta.resolve(npm_name)))
  return join(module_path, ...parts)
}
