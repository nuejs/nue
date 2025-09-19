
import { join } from 'node:path'
import { mkdir } from 'node:fs/promises'
import { routes, fetch, matches } from 'nueserver'

import { createDB } from './db.js'
import { createKV } from './kv.js'

export async function importRoutes({ dir, reload }) {
  const path = join(process.cwd(), dir, 'index.js') + (reload ? '?t=' + Date.now() : '')

  try {
    routes.length = 0
    await import(path)

  } catch (err) {
    if (err.code == 'ERR_MODULE_NOT_FOUND') return null
    throw err
  }
}


export async function createWorker(opts = {}) {
  const { dir='@shared/server', reload } = opts

  await importRoutes({ dir, reload })
  if (!routes.length) return null

  const { db, kv } = opts
  const env = { ...process.env, ...opts.env }
  if (db) env.DB = createDB(join(dir, db))
  if (kv) env.KV = createKV(join(dir, kv))


  return async function(req) {
    if (reload)  await importRoutes({ dir, reload })
    const url = new URL(req.url)
    const { method, body } = req

    const match = matches(method, url.pathname)
    if (!match) return null

    const headers = { ...getCFHeaders(), ...Object.fromEntries(req.headers) }
    const workerReq = new Request(req.url, { method, headers, body })

    return await fetch(workerReq, env)
  }
}

function getCFHeaders() {
  return {
    // Location headers
    'cf-ipcountry': 'FI',
    'cf-ipcity': 'Helsinki',
    'cf-ipcontinent': 'EU',
    'cf-iplongitude': '24.95034',
    'cf-iplatitude': '60.18427',
    'cf-region': 'Uusimaa',
    'cf-region-code': 'FI-18',
    'cf-metro-code': '0',
    'cf-postal-code': '00500',
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

