
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { createDB } from './db.js'
import { createKV } from './kv.js'

async function createServer({ dir, reload }) {
  const path = join(dir, 'index') + (reload ? '?t=' + Date.now() : '')

  try {
    const server = await import(join(process.cwd(), path))
    return server.default
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') return null
    throw err
  }
}


export async function createWorker(opts = {}) {
  const { dir='@system/worker', reload } = opts

  let server = await createServer({ dir, reload })
  if (!server) return null

  const dbDir = join(dir, 'db')
  await mkdir(dbDir, { recursive: true })

  const env = { ...process.env, ...opts,
    DB: createDB(join(dbDir, 'app.db')),
    KV: createKV(join(dbDir, 'kv.json')),
  }

  return async function(req) {
    if (reload) server = await createServer({ dir, reload })
    const url = new URL(req.url)
    const { method, body } = req

    const match = matches(server.routes, { url: url.pathname + url.search, method })
    if (!match) return null

    const headers = { 'cf-ipcountry': 'FI', ...Object.fromEntries(req.headers) }
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

