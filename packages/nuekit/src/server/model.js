
import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const SESSIONS_PATH = join(process.cwd(), '.nue', 'sessions.json')
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
  async function getAll() {
    return items
  }

  async function size() {
    return items.length
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

  return { getAll, size, create, get }
}


async function saveSessions(sessions) {
  await mkdir(join(process.cwd(), '.nue'), { recursive: true })
  await writeFile(SESSIONS_PATH, JSON.stringify([...sessions], null, 2))
}

async function readSessions() {
  try {
    const data = await readFile(SESSIONS_PATH, 'utf-8')
    return new Set(JSON.parse(data))
  } catch {
    return new Set()
  }
}



// specialized models
async function createUserModel(items) {
  const users = createModel(items)
  const sessions = await readSessions()

  async function login(email, password) {
    const user = (await users.getAll()).find(el => el.email == email)

    // mock: plaintext passwords. production uses hashed
    if (user?.password == password) {
      const sessionId = crypto.randomUUID()
      sessions.add(sessionId)
      await saveSessions(sessions)
      return { sessionId, user }
    }
  }

  async function authenticate(sessionId) {
    return sessions.has(sessionId)
  }

  async function logout(sessionId) {
    sessions.delete(sessionId)
    await saveSessions(sessions)
  }

  return { ...users, login, logout, authenticate }
}



export async function createEnv(dir) {
  const files = await readdir(dir)
  const env = {}

  for (const file of files) {
    if (file.endsWith('.json')) {
      const type = file.replace('.json', '')
      const path = join(dir, file)
      const items = JSON.parse(await readFile(path, 'utf8'))
      const model = env[type] = type == 'users' ? await createUserModel(items) : createModel(items)
      console.log(`Model "${type}" loaded (${ await model.size() } records)`)
    }
  }

  return env
}