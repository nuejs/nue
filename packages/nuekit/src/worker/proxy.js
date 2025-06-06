
import http from 'node:http'

export function createProxy(conf) {
  return {

    matches(req) {
      return conf.routes.some(path => req.url.startsWith(path))
    },

    async handle(req, res) {
      const target = new URL(conf.url)
      const fullUrl = `${target.protocol}//${target.host}${req.url}`

      // Simplified body reading
      const body = req.method !== 'GET' && req.method !== 'HEAD'
        ? Buffer.concat(await req.toArray())
        : null

      const response = await fetch(fullUrl, {
        method: req.method,
        headers: req.headers,
        body
      })

      // Simplified response copying
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(await response.arrayBuffer())
    }
  }
}

