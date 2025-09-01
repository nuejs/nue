
import { Database } from 'bun:sqlite'

export function createDB(path) {
  const db = new Database(path, { create: true })
  
  return {
    prepare: (sql) => {
      const stmt = db.prepare(sql)

      const createMethods = (boundParams = []) => ({
        first: async (...params) => stmt.get(...boundParams, ...params),
        all: async (...params) => stmt.all(...boundParams, ...params),
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