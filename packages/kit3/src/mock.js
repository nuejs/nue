
import { join } from 'node:path'

export async function createMockServer(dir) {
  const people = await createMock(dir, 'people.json')
  const users = await createMock(dir, 'users.json')

  return async function(req) {
    const { pathname } = new URL(req.url)
    if (!pathname.startsWith('/nue/')) return

    const { method } = req
    const path = pathname.slice(4)
    const id = path.split('/')[2]

    // POST /nue/people
    if (method == 'POST' && path == '/people') {
      const person = await req.json()
      await people.add(person)
      return new Response('ok')
    }

    // POST /nue/login
    if (method == 'POST' && path == '/login') {
      const { email, password } = await req.json()
      const user = users.data.find(u => u.email == email && u.password == password)
      if (!user) return new Response('unauthorized', { status: 401 })

      const token = randomID() + '-' + randomID()
      user.token = token
      await users.save()

      return Response.json({ token })
    }

    // POST /nue/logout
    if (method == 'POST' && path == '/logout') {
      const token = getToken(req)
      const user = users.data.find(u => u.token == token)
      if (user) {
        delete user.token
        await users.save()
      }
      return new Response('ok')
    }

    // everything after this must be authenticated
    if (!isAuthenticated(req, users)) {
      return new Response('unauthorized', { status: 401 })
    }

    // GET /nue/people
    if (method == 'GET' && path == '/people') {
      return Response.json(people.data)
    }

    // GET /nue/people/:id
    if (method == 'GET' && path.startsWith('/people/') && id) {
      const person = people.data.find(p => p.id == id)
      if (person) return Response.json(person)
    }
  }
}

// check for bearer token
function isAuthenticated(req, users) {
  const token = getToken(req)
  if (!token) return false
  return users.data.some(u => u.token == token)
}

function getToken(req) {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  return auth.slice(7)
}

async function createMock(dir, name) {
  const path = join(dir, name)
  const file = Bun.file(path)

  // create file if it doesn't exist
  const data = await file.exists() ? JSON.parse(await file.text()) : []

  async function save() {
    await Bun.write(path, JSON.stringify(data, null, 2))
  }

  async function add(item) {
    item.id = 'uid-' + randomID()
    data.push(item)
    await save()
  }

  return { data, add, save }
}

// return 6 random chars
function randomID() {
  return Math.random().toString(36).slice(2, 8)
}

