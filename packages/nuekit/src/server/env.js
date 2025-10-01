
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const NOW = Date.now()
const DAY = 86400000


function createModel(items) {

  items.forEach((el, i) => {
    el.created = NOW - DAY * i
    el.id = i + 1
  })

  async function create(obj) {
    const id = items.length + 1
    const created = Date.now()
    const item = { id, created, ...obj }
    items.unshift(item)
    return item
  }

  // implemented with true event sourcing later
  async function all() {
    return items
  }

  async function get(id) {
    const item = items.find(el => el.id == id)
    return {
      ...item,

      async update(data) {
        Object.assign(item, data)
        return item
      },

      async remove() {
        const i = items.indexOf(item)
        items.splice(i, 1)
      }
    }
  }

  return { all, create, get }
}

// specialized models
function createUserModel(items) {
  const users = createModel(items)
  const sessions = new Set()

  async function login(email, password) {
    const user = (await users.all()).find(el => el.email == email)

    // mock: plaintext passwords. production uses hashed
    if (user?.password == password) {
      const sessionId = crypto.randomUUID()
      sessions.add(sessionId)
      return { sessionId, user }
    }
  }

  async function authenticate(sessionId) {
    return sessions.has(sessionId)
  }

  async function logout(sessionId) {
    sessions.delete(sessionId)
  }

  return { ...users, login, logout, authenticate }
}

export async function createEnv(dir) {
  const files = await readdir(join(process.cwd(), dir))
  const env = {}

  for (const file of files) {
    if (file.endsWith('.json')) {
      const type = file.replace('.json', '')
      const path = join(process.cwd(), dir, file)
      const items = JSON.parse(await readFile(path, 'utf8'))
      env[type] = type == 'users' ? createUserModel(items) : createModel(items)
    }
  }

  return env
}