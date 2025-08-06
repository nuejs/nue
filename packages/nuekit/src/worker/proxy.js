
export function createProxy(opts) {

  return async function(req) {
    const url = new URL(req.url)
    const match = opts.routes.some(path => url.pathname.startsWith(path))
    if (!match) return null

    const { method, headers } = req
    const target = new URL(opts.url)
    const fullUrl = `${target.protocol}//${target.host}${url.pathname}${url.search}`
    const body = ['GET', 'HEAD'].includes(method) ? null : await req.arrayBuffer()

    return await fetch(fullUrl, { headers, method, body })
  }
}