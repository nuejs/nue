
export function createServer({ port=4000, handler }, callback) {

  async function fetch(req) {

    // custom handler (proxy or worker)
    const result = handler && await handler(req)
    if (result) return result

    // WebSocket connection for HMR
    const url = new URL(req.url)

    if (req.headers.get('upgrade') == 'websocket') {
      hmr.host = url.host
      return server.upgrade(req) ? undefined : new Response('Upgrade failed', { status: 500 })
    }

    // regular file serving
    try {
      const res = await callback(url)

      // res = Bun.file
      if (res?.stream) return new Response(res, { status: 200 })

      // res = { content, type, status } || HTML <string>
      if (res) {
        return new Response(res.content || res, {
          headers: { 'Content-Type': res.type || 'text/html; charset=utf-8' },
          status: res.status || 200
        })

      } else {
        console.error('Not found', url.pathname)
        return new Response('404 Not Found', { status: 404 })
      }

    } catch (e) {
      console.error(e)
      return new Response('500 Server Error', { status: 500 })
    }
  }

  const websocket = {
    open(ws) {
      sessions.push(ws)
    },
    close(ws) {
      const i = sessions.indexOf(ws)
      if (i >= 0) sessions.splice(i, 1)
    }
  }

  const server = Bun.serve({ idleTimeout: 0, port, fetch, websocket })
  return server
}

const sessions = []

export const hmr = {
  host: null,

  sessions,

  broadcast(data) {
    sessions.forEach(ws => {
      try { ws.send(JSON.stringify(data)) } catch(e) {}
    })
  }
}




