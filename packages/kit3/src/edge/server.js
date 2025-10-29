

export function createEdgeServer(tree, conf) {

  return async function(req) {
    const { method, pathname, host } = new URL(req.url)
    if (!pathname.startsWith('/api')) return

    const data = { hello: 'world' }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

}