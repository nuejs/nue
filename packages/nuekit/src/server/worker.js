
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { createDB } from './db.js'
import { createKV } from './kv.js'

async function importServer({ dir, reload }) {
  const path = join(dir, 'index.js') + (reload ? '?t=' + Date.now() : '')

  try {
    const server = await import(join(process.cwd(), path))
    return server.default
  } catch (err) {
    if (err.code == 'ERR_MODULE_NOT_FOUND') return null
    throw err
  }
}


export async function createWorker(opts = {}) {
  const { dir='@system/server', reload } = opts

  let server = await importServer({ dir, reload })
  if (!server) return null

  const { db, kv } = opts
  const env = { ...process.env, ...opts.env }
  if (db) env.DB = createDB(join(dir, db))
  if (kv) env.KV = createKV(join(dir, kv))


  return async function(req) {
    if (reload) server = await importServer({ dir, reload })
    const url = new URL(req.url)
    const { method, body } = req

    const match = matches(server.routes, { url: url.pathname + url.search, method })
    if (!match) return null

    const headers = { ...getCFHeaders(), ...Object.fromEntries(req.headers) }
    const proxyRequest = new Request(req.url, { method, headers, body })

    return await server.fetch(proxyRequest, env)
  }
}

export function matches(routes, { url, method }) {
  return routes.some(route => {
    const { path } = route
    if (route.method != method) return false

    const urlPath = url.split('?')[0]

    if (path == urlPath) return true

    if (path.endsWith('/*')) return urlPath.startsWith(path.slice(0, -1))

    if (path.includes(':')) {
      const routeParts = path.split('/')
      const pathParts = urlPath.split('/')
      return routeParts.length == pathParts.length &&
        routeParts.every((part, i) => part.startsWith(':') || part == pathParts[i])
    }

    return false
  })
}


function getCFHeaders() {
  return {
    // Location headers
    'cf-ipcountry': 'FI',
    'cf-ipcity': 'Helsinki',
    'cf-ipcontinent': 'EU',
    'cf-iplongitude': '24.9384',
    'cf-iplatitude': '60.1699',
    'cf-region': 'Uusimaa',
    'cf-region-code': 'FI-18',
    'cf-metro-code': '0',
    'cf-postal-code': '00100',
    'cf-timezone': 'Europe/Helsinki',

    // Other CF headers
    'cf-ray': '8' + Math.random().toString().slice(2, 18),
    'cf-visitor': '{"scheme":"https"}',
    'cf-connecting-ip': '127.0.0.1',
    'cf-request-id': Math.random().toString(16).slice(2, 18),
    'cf-cache-status': 'DYNAMIC',
    'cf-edge-request-id': Math.random().toString(16).slice(2, 18),
    'cf-worker': 'localhost'
  }
}

