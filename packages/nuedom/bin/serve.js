
const server = Bun.serve({
  port: 4400,

  routes: {
    '/favicon.ico': async () => {
      return new Response('', { headers: { 'Content-Type': 'text/plain' } })
    },
  },


  fetch(req) {
    let path = new URL(req.url).pathname
    if (path.endsWith('/')) path += 'index.html'
    return new Response(Bun.file('.' + path))
  }
})

console.log('\nDemo ready:\n')
console.log(`✅ Browser: ${server.url}test/\n`)
console.log(`✅ Editor:  test/index.html\n`)
