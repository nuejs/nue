
export const sessions = []

export function createServer({ port=3000, worker }, callback) {

  async function fetch(req) {
    const { pathname } = new URL(req.url)

    // worker request
    if (worker) {
      const result = await worker(req)
      if (result) return result
    }

    // hot reloading
    if (pathname == '/hmr') return handleHMR(req)


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

  return Bun.serve({ idleTimeout: 0, port, fetch })
}



function handleHMR(req) {
  const url = new URL(req.url)
  const params = url.searchParams

  const stream = new ReadableStream({
    start(session) {

      session.location = params.get('url')

      session.broadcast = function(data) {
        try {
          const message = `data:${JSON.stringify(data)}\n\n`
          session.enqueue(new TextEncoder().encode(message))

        } catch(e) {
          const i = sessions.indexOf(session)
          sessions.splice(i, 1) // cleanup
        }
      }

      sessions.push(session)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

