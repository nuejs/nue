
/*
  Super minimalistic web server for

  1. Static hosting
  2. Dynamic requests
  3. Server-send events (SSE)
*/
import { join, extname } from 'node:path'
import { promises as fs } from 'node:fs'
import http from 'node:http'
let sessions = []


export const TYPES = {
  html: 'text/html; charset=UTF-8',
  js:   'application/javascript',
  json: 'application/json',
  svg:  'image/svg+xml',
  ico:  'image/x-icon',
  webp: 'image/webp',
  png:  'image/png',
  jpeg: 'image/jpg',
  jpg:  'image/jpg',
  css:  'text/css',
  csv:  'text/csv',
}

export function createServer(root, callback) {
  return http.createServer(async (req, res) => {

    // SSE for hot-reloading
    if (req.headers.accept == 'text/event-stream') {
      sessions.unshift(res)

      return res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      })
    }

    let [ url, _ ] = req.url.split('?')
    const ext = extname(url).slice(1)

    if (!ext) url = join(url, 'index.html')

    try {
      const { code, path } = !ext || ext == 'html' ? await callback(url, _) : { path: url }
      if (!path) throw { errno: -2 }
      res.writeHead(code || 200, { 'content-type': TYPES[ext] || TYPES.html })
      res.end(await fs.readFile(join(root, path)))
  
    } catch(e) {
      const nf = e.errno == -2 // not found
      nf ? console.log('Not found', url) : console.error(e)
      res.writeHead(nf ? 404 : 500)
      res.end(nf ? '404 | Not found' : '500 | Server error')
    }
  })
}

export function send(data) {
  sessions = sessions.filter((session, i) => {
    session.write(`data:${JSON.stringify(data)}\n\n`)

    // Bun (v1.0.11) needs an extra call to bring the channel up
    if (process.isBun && !session.alive) {
      session.write(`data:{"ping":true}\n\n`)
      session.alive = true
    }

    // filter out dead sessions. max sessions = 5
    return session.writable && i < 5
  })
}







