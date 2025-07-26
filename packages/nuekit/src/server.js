
let sessions = []

export function createServer({ port=3000, worker, dist }, callback) {

  async function fetch(req) {
    const url = new URL(req.url)

    // worker request
    if (worker) {
      const result = await worker(req)
      if (result) return result
    }

    // hot reloading
    if (url.pathname == '/hmr') return handleHMR()


    // regular file serving
    try {
      const file = await callback(url)

      if (file && await file.exists()) {
        const status = file.name.endsWith('404.html') ? 404 : 200
        return new Response(file, { status })
      } else {
        console.error('Not found', url.pathname)
        return new Response('404 | Not found', { status: 404 })
      }

    } catch (e) {
      console.error(e)
      return new Response('500 | Server error', { status: 500 })
    }
  }

  const server = Bun.serve({port, fetch })

  server.broadcast = function(data) {
    const message = `data:${JSON.stringify(data)}\n\n`
    sessions = sessions.filter((session, i) => {
      try {
        session.enqueue(new TextEncoder().encode(message))
        return i < 5
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

