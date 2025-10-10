
import { extname, join } from 'node:path'

import { createServer } from '../tools/server'
import { getServer } from '../server'


export async function preview(conf, opts) {
  const { dist=".dist" } = conf
  const port = opts.port || 4040

  // dist directory
  const has_index = await Bun.file(join(dist, 'index.html')).exists()
  if (!has_index) return console.error('run `nue build` first')

  // user server
  const handler = await getServer(conf?.server)

  // dev server
  const server = createServer({ port, handler }, url => getFile(dist, url))

  const url = server.url.toString()
  console.log('Serving on', url)

  return { stop() { server.stop() }, url, port, }

}

export async function getFile(dist, url) {

  // favicon
  if (url == '/favicon.ico') return Bun.file(join(import.meta.dir, '../../favicon.ico'))

  // file
  let path = join(dist, url)
  if (url.endsWith('/')) path += 'index.html'

  const ext = extname(path)
  if (!ext) path += '.html'

  const file = Bun.file(path)
  if (await file.exists()) return file

  // 404
  if (!ext) {
    const err_page = Bun.file(join(dist, '404.html'))
    if (await err_page.exists()) return err_page
  }
}

