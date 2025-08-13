
import { extname, join } from 'node:path'

import { createServer } from '../tools/server'
import { readSiteYAML } from '../assets'
import { getServer } from '../server'


export async function getFile(dist, url) {

  // favicon
  if (url == '/favicon.ico') return Bun.file(join(import.meta.dir, '../../favicon.ico'))

  // file
  let path = join(dist, url)
  const ext = extname(url)
  if (!ext) path += url.endsWith('/') ? 'index.html' : '.html'

  const file = Bun.file(path)
  if (await file.exists()) return file

  // 404
  if (!ext) {
    const err = Bun.file(join(dist, '404.html'))
    if (await err.exits()) return err
  }
}


export async function preview({ root, port }) {
  const conf = await readSiteYAML(root)
  if (!conf) return console.error('Not a Nue directory')

  // dist directory
  const dist = join(root, '.dist')
  const exists = await Bun.file(join(dist, 'index.html')).exists()
  if (!exists) return console.error('run `nue build` first')

  // user server
  const handler = await getServer(conf?.server)

  // dev server
  const server = createServer({ port, handler }, url => getFile(dist, url))

  const url = server.url.toString()
  console.log('Serving on', url)

  return { stop() { server.stop() }, url, port, }

}

