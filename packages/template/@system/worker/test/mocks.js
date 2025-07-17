
import { Database } from 'bun:sqlite'

export function createDB() {
  const db = new Database()

  return {
    prepare: (sql) => {
      const stmt = db.prepare(sql)

      const createMethods = (boundParams = []) => ({
        first: async (...params) => stmt.get(...boundParams, ...params),
        all: async (...params) => stmt.all(...boundParams, ...params),
        raw: async (...params) => stmt.raw(...boundParams, ...params),
        run: async (...params) => stmt.run(...boundParams, ...params),
        bind: (...params) => createMethods([...boundParams, ...params])
      })

      return createMethods()
    },
    exec: async (sql) => db.exec(sql),
    batch: async (statements) => db.transaction(() =>
      statements.map(stmt => stmt.run())
    )()
  }
}

export function createKV() {
  const store = new Map()

  return {
    async get(key, opts) {
      const val = store.get(key)
      return val == null ? null : opts?.type == 'json' ? JSON.parse(val) : val
    },

    async put(key, value) {
      store.set(key, typeof value == 'object' ? JSON.stringify(value) : String(value))
    },

    delete: async function(key) {
      return store.delete(key)
    },

    async list(opts = {}) {
      const { prefix = '', limit = 1000 } = opts
      const keys = Array.from(store.keys())
        .filter(key => key.startsWith(prefix))
        .slice(0, limit)
      return {
        keys: keys.map(name => ({ name })),
        list_complete: true,
        cursor: null
      }
    }
  }
}


export const env = { KV: createKV(), DB: createDB() }



