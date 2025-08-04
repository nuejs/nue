
import { mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { compileJS } from './asset'

async function getVersion() {
  const file = Bun.file(join(import.meta.dir, '../package.json'))
  return (await file.json()).version
}

export const version = await getVersion()

export function getClientFiles() {
  return 'error hmr mount router'.split(' ').map(name => {
    const base = `${name}.js`
    return { base, rootpath: join(import.meta.dir, '../client', base) }
  })
}

export function getPackages() {
  return [
    { base: 'nue.js', rootpath: resolve('nuedom/src/nue.js'), bundle: true },
    { base: 'state.js', rootpath: resolve('nuestate/src/state.js') },
  ]
}

function resolve(pkg) {
  return fileURLToPath(import.meta.resolve(pkg))
}

export function getSystemFiles(is_prod) {
  let files = [ ...getClientFiles(), ...getPackages() ]
  if (is_prod) files = files.filter(el => !['error.js', 'hmr.js'].includes(el.base))

  for (const file of files) {
    file.url = `/@nue/${file.base}`

    file.render = async function() {
      if (is_prod || file.bundle) {
        return await compileJS(file.rootpath, is_prod, file.bundle)
      }
      // if (!file.content) file.content =
      // return file.content
    }

    file.contentType = async function() {
      return 'application/javascript'
    }
  }
  return files
}


export async function createSystemFiles(dist, force) {
  const dir = join(process.cwd(), dist, '@nue')

  const ver = Bun.file(join(dir, version))
  if (!force && await ver.exists()) return false

  // recreate direcotry
  await rm(dir, { recursive: true, force: true })
  await mkdir(dir, { recursive: true })

  // write version file
  await ver.writer().end()

  const files = getSystemFiles(true)

  for (const file of files) {
    Bun.write(join(dir, file.base), await file.render())
  }

  return files
}

