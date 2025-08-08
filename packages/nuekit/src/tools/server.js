
export const sessions = []

export function createServer({ port=4000, handler }, callback) {

  async function fetch(req) {
    const { pathname } = new URL(req.url)

    // custom handler (proxy or worker)
    const result = handler && await handler(req)
    if (result) return result

    // hot reloading
    if (pathname == '/hmr') return handleHMR(req)


    // regular file serving
    try {
      const res = await callback(pathname)

      // res = Bun.file
      if (res?.stream) return new Response(res, { status: 200 })

      // res = { content, type, status } || HTML <string>
      if (res) {
        return new Response(res.content || res, {
          headers: { 'Content-Type': res.type || 'text/html' },
          status: res.status || 200
        })

      } else {
        console.error('Not found', pathname)
        return new Response('404 Not Found', { status: 404 })
      }

    } catch (e) {
      console.error(e)
      return new Response('500 Server Error', { status: 500 })
    }
  }

  return Bun.serve({ idleTimeout: 0, port, fetch })
}


function handleHMR(req) {
  const url = new URL(req.url)
  const params = url.searchParams
  let curr

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
      curr = session
    },

    cancel() {
      const i = sessions.indexOf(curr)
      if (i >= 0) sessions.splice(i, 1)
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

