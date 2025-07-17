import { join, extname } from 'node:path'

let sessions = []

export function createServer({ port=3000, worker, dist }, callback) {

  async function fetch(req) {
    const url = new URL(req.url)
    let path = url.pathname
    let ext = extname(path).slice(1)

    // worker request
    if (worker) {
      const result = await worker(req)
      if (result) return result
    }

    // SSE for hot-reloading
    if (req.headers.get('accept') == 'text/event-stream') {
      return handleSSE()
    }

    // default to index.html for directories
    if (!ext) {
      ext = 'html'
    }

    try {
      const result = (!ext || ext == 'html')
        ? await callback(path, url.search)
        : { path }

      if (!result.path) {
        return new Response('404 | Not found', { status: 404 })
      }

      let filePath = result.path
      if (!extname(filePath)) {
        filePath = join(filePath, 'index.html')
      }

      const file = Bun.file(join(dist, filePath))

      if (!(await file.exists())) {
        console.log('Not found', path)
        return new Response('404 | Not found', { status: 404 })
      }

      return new Response(file, {
        status: result.code || 200
      })

    } catch (e) {
      console.error(e)
      return new Response('500 | Server error', { status: 500 })
    }
  }

  const server = Bun.serve({port, fetch })

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