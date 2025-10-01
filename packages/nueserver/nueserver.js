
// Nueserver: Edge-first HTTP server
export const routes = []

// Context for each request
function createContext(req, env = {}) {
  const url = new URL(req.url)

  const contextReq = {
    ...req,
    param: (key) => contextReq._params?.[key],
    query: (key) => {
      if (key) return url.searchParams.get(key)
      const params = {}
      for (const [k, v] of url.searchParams.entries()) params[k] = v
      return params
    },
    json: () => req.json(),
    text: () => req.text(),
    header: (key) => req.headers.get(key)
  }

  return {
    req: contextReq,
    env,
    json: (data, status = 200) => Response.json(data, { status }),
    text: (text, status = 200) => new Response(text, { status }),
    status: status => ({ json: data => Response.json(data, { status }) })
  }
}

// Check if a route matches this method and path
export function matches(method, path) {
  for (const route of routes) {

    // middleware == no method
    if (!route.method || route.method == method.toUpperCase()) {
      const { match } = matchPath(route.path, path)
      if (match) return true
    }
  }

  return false
}

export function matchPath(pattern, path) {
  if (pattern == '*') return { match: true, params: {} }

  const parts = pattern.split('/')
  const pathParts = path.split('/')

  // Handle trailing wildcard
  const hasWildcard = parts[parts.length - 1] == '*'
  const len = hasWildcard ? parts.length - 1 : parts.length

  // wildcard -> path must be LONGER than pattern (minus *)
  // exact match -> lengths must be equal
  if (hasWildcard ? pathParts.length <= len : pathParts.length != len) {
    return { match: false }
  }

  const params = {}

  for (let i = 0; i < len; i++) {
    const patternPart = parts[i]
    const pathPart = pathParts[i]

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = pathPart
    } else if (patternPart != pathPart) {
      return { match: false }
    }
  }

  return { match: true, params }
}

globalThis.get = (path, handler) => {
  routes.push({ method: 'GET', path, handler })
}

globalThis.post = (path, handler) => {
  routes.push({ method: 'POST', path, handler })
}

globalThis.del = (path, handler) => {
  routes.push({ method: 'DELETE', path, handler })
}

globalThis.use = (path, handler) => {
  if (typeof path == 'function') {
    handler = path
    path = '*'
  }
  routes.push({ path, handler })
}

// Main request handler
export async function fetch(request, env = {}) {
  const url = new URL(request.url)
  const method = request.method
  const path = url.pathname

  const context = createContext(request, env)

  try {

    // process all routes in order
    for (const route of routes) {

      if (route.method && route.method != method) continue

      const { match, params } = matchPath(route.path, path)
      if (!match) continue

      context.req._params = params

      if (!route.method) {
        // Middleware: call with next() function
        const result = await route.handler(context, () => Promise.resolve())
        if (result instanceof Response) return result

      } else {
        // Regular route: call directly
        const result = await route.handler(context)
        if (result instanceof Response) return result
      }
    }

    return new Response('Not Found', { status: 404 })

  } catch (error) {
    console.error('Server error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}


// Auto-export for CloudFlare Workers
export default { fetch }
