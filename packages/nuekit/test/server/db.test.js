
import { unlinkSync, existsSync } from 'fs'
import { createDB } from '../../src/server/db.js'

const testDbPath = './test.db'

beforeEach(() => {
  if (existsSync(testDbPath)) {
    unlinkSync(testDbPath)
  }
})

afterEach(() => {
  if (existsSync(testDbPath)) {
    unlinkSync(testDbPath)
  }
})

test('createDB operations', async () => {
  const db = createDB(testDbPath)
  
  // Setup table
  await db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')
  
  // Test prepare with different methods
  const insert = db.prepare('INSERT INTO users (name) VALUES (?)')
  const select = db.prepare('SELECT * FROM users WHERE name = ?')
  const selectAll = db.prepare('SELECT * FROM users')
  
  // Test run
  const result = await insert.run('John')
  expect(result.changes).toBe(1)
  
  // Test first
  const user = await select.first('John')
  expect(user.name).toBe('John')
  
  // Insert more data
  await insert.run('Jane')
  
  // Test all
  const users = await selectAll.all()
  expect(users.length).toBe(2)
  
  // Test bind
  const boundSelect = select.bind('Jane')
  const boundUser = await boundSelect.first()
  expect(boundUser.name).toBe('Jane')
  
  // Test batch
  const stmt1 = insert.bind('Alice')
  const stmt2 = insert.bind('Bob')
  await db.batch([stmt1, stmt2])
  
  const allUsers = await selectAll.all()
  expect(allUsers.length).toBe(4)
})
