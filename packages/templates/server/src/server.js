
import { getItems, getItem } from './api'


function getHostName(req) {
  const { hostname } = new URL(req.url)
  return hostname.slice(0, hostname.lastIndexOf('.'))
}

const server = Bun.serve({

  routes: {
    '/api/items': async req => {
      const hostname = getHostName(req)
      return Response.json(await getItems(hostname))
    },

    '/api/item/:key': async req => {
      const hostname = getHostName(req)
      return Response.json(await getItem(hostname, req.params.key))
    }
  }

})

console.log(`Server running at ${server.url}`)