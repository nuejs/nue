
import { createKV } from './kv.js'
import { createDB } from './db.js'

async function createServer(conf) {
  const path = `${conf.dir}/${conf.server}` + (conf.reload ? '?t=' + Date.now() : '')
  const server = await import(process.cwd() + '/' + path)
  return server.default
}

// local worker
export function createWorker(conf) {
  const env = {
    ...process.env, ...conf,
    DB: createDB(`${conf.dir}/db/app.db`),
    KV: createKV(`${conf.dir}/db/app.json`),
  }

  let server

  return {
    async matches(req) {
      if (!server || conf.reload) server = await createServer(conf)
      return matches(server.routes, req)
    },

    async handle(req, res) {


      const request = new Request(`http://localhost${req.url}`, {
        method: req.method,
        headers: { 'cf-ipcountry': 'FI', ...req.headers },
        body: await parseBody(req),
      })

      const response = await server.fetch(request, env)
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(await response.text())
    }
  }

}


// required when using Node's old school http package (Not fetch based server like Bun)
async function parseBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return chunks.length > 0 ? Buffer.concat(chunks).toString() : null
}


export function matches(routes, { url, method }) {
  
  return routes.some(route => {
    const { path } = route

    // Check method first
    if (route.method != method) return false
    
    // Exact match
    if (path == url) return true
    
    // Wildcard match (/api/* matches /api/anything)
    if (path.endsWith('/*')) {
      return url.startsWith(path.slice(0, -1))
    }
    
    // Parameter match (/api/:id)
    if (path.includes(':')) {
      const routeParts = path.split('/')
      const pathParts = url.split('/')
      
      return routeParts.length == pathParts.length &&
        routeParts.every((part, i) => part.startsWith(':') || part == pathParts[i])
    }
    return false
  })
}
