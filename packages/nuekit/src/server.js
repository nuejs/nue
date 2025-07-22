import { join, extname } from 'node:path'

let sessions = []

export function createServer({ port=3000, worker, dist }, callback) {

  async function fetch(req) {
    const { pathname } = new URL(req.url)

    // worker request
    if (worker) {
      const result = await worker(req)
      if (result) return result
    }

    // SSE for hot-reloading
    if (req.headers.get('accept') == 'text/event-stream') return handleSSE()


    // regular file serving
    try {
      const file = await callback(pathname)

      if (!(await file.exists())) {
        console.error('Not found', pathname)
        return new Response('404 | Not found', { status: 404 })
      }

      return new Response(file, { status: file.name.endsWith('404.html') ? 404 : 200 })

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

function handleSSE() {
  let controller

  const stream = new ReadableStream({
    start(c) {
      controller = c
      sessions.unshift(controller)
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