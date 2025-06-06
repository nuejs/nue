/*
  Super minimalistic web server for

  1. Static hosting
  2. Dynamic requests
  3. Server-send events (SSE)
*/
import { join, extname } from 'node:path'
import { promises as fs } from 'node:fs'
import http from 'node:http'

import { getWorker } from './worker'

export const TYPES = {
  html:  'text/html; charset=UTF-8',
  js:    'application/javascript',
  wasm:  'application/wasm',
  json:  'application/json',
  svg:   'image/svg+xml',
  ico:   'image/x-icon',
  webp:  'image/webp',
  png:   'image/png',
  jpeg:  'image/jpeg',
  jpg:   'image/jpeg',
  txt:   'text/plain',
  css:   'text/css',
  csv:   'text/csv',
  woff:  'font/woff',
  woff2: 'font/woff2',
  ttf:   'font/ttf',
  otf:   'font/otf',
  eot:   'application/vnd.ms-fontobject',
  mp4:   'video/mp4',
  webm:  'video/webm',
  mp3:   'audio/mpeg',
  ogg:   'audio/ogg',
  default: 'application/octet-stream'
}

let sessions = []


export function createServer(opts, callback) {
  const worker = getWorker(opts.worker)

  return http.createServer(async (req, res) => {
    let [url, _] = req.url.split('?')
    let ext = extname(url).slice(1)

    // worker request
    if (await worker.matches(req)) return await worker.handle(req, res)

    // SSE for hot-reloading
    if (req.headers.accept == 'text/event-stream') {
      sessions.unshift(res)

      return res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      })
    }

    if (!ext) { url = join(url, 'index.html'); ext = 'html' }

    try {
      const { code, path } = !ext || ext == 'html' ? await callback(url, _) : { path: url }
      if (!path) throw { errno: -2 }
      const buffer = await fs.readFile(join(opts.dist, path))
      res.writeHead(code || 200, {
        'content-type': TYPES[ext] || TYPES.default
      })      
      res.end(buffer)

    } catch (e) {
      const nf = e.errno == -2 // not found
      nf ? console.log('Not found', url) : console.error(e)
      res.writeHead(nf ? 404 : 500)
      res.end(nf ? '404 | Not found' : '500 | Server error')
    }
  })
}

export function send(data) {
  sessions = sessions.filter((session, i) => {

    try {
      session.write(`data:${JSON.stringify(data)}\n\n`)
      return i < 5 // max browsers to notify: 5

    } catch(e) {
      return false
    }
  })
}
