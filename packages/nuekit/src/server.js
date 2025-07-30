
let sessions = []

export function createServer({ port=3000, worker }, callback) {

  async function fetch(req) {
    const { pathname } = new URL(req.url)

    // worker request
    if (worker) {
      const result = await worker(req)
      if (result) return result
    }

    // hot reloading
    if (pathname == '/hmr') return handleHMR()


    // regular file serving
    try {
      const res = await callback(pathname)

      // Bun.file
      if (res?.stream) {
        return new Response(res, { status: 200 })

      // Object: { content, type, status }
      } else if (res) {
        return new Response(res.content || res, {
          headers: { 'Content-Type': res.type || 'text/html' },
          status: res.status || 200
        })

      } else {
        console.error('Not found', pathname)
        return new Response('404 | Not found', { status: 404 })
      }

    } catch (e) {
      console.error(e)
      return new Response('500 | Server error', { status: 500 })
    }
  }

  const server = Bun.serve({ idleTimeout: 0, port, fetch })

  server.broadcast = function(data) {
    const message = `data:${JSON.stringify(data)}\n\n`
    sessions = sessions.filter((session, i) => {
      try {
        session.enqueue(new TextEncoder().encode(message))
        return true
      } catch(e) {
        return false
      }
    })
  }

  return server
}

function handleHMR() {
  const stream = new ReadableStream({
    start(session) { sessions.unshift(session) }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

