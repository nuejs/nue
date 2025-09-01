import { createDB, createKV, env } from '../src/mock.js'

// test database mock
test('createDB basic operations', async () => {
  const db = createDB()
  
  await db.exec('CREATE TABLE users (id INTEGER, name TEXT)')
  
  const insert = db.prepare('INSERT INTO users VALUES (?, ?)')
  const result = await insert.run(1, 'alice')
  expect(result.changes).toBe(1)
  
  const select = db.prepare('SELECT * FROM users WHERE id = ?')
  const user = await select.first(1)
  expect(user.name).toBe('alice')
  
  const all = await db.prepare('SELECT * FROM users').all()
  expect(all.length).toBe(1)
})

test('createDB bind parameters', async () => {
  const db = createDB()
  await db.exec('CREATE TABLE test (val TEXT)')
  
  const stmt = db.prepare('INSERT INTO test VALUES (?)').bind('hello')
  await stmt.run()
  
  const result = await db.prepare('SELECT * FROM test').first()
  expect(result.val).toBe('hello')
})

// test kv mock
test('createKV basic operations', async () => {
  const kv = createKV()
  
  await kv.put('key1', 'value1')
  expect(await kv.get('key1')).toBe('value1')
  
  await kv.put('key2', { foo: 'bar' })
  const obj = await kv.get('key2', { type: 'json' })
  expect(obj.foo).toBe('bar')
  
  await kv.delete('key1')
  expect(await kv.get('key1')).toBeNull()
})

test('createKV list operations', async () => {
  const kv = createKV()
  
  await kv.put('prefix:1', 'val1')
  await kv.put('prefix:2', 'val2')
  await kv.put('other', 'val3')
  
  const result = await kv.list({ prefix: 'prefix:' })
  expect(result.keys.length).toBe(2)
  expect(result.list_complete).toBe(true)
})

// test env export
test('env export', () => {
  expect(env.DB).toBeDefined()
  expect(env.KV).toBeDefined()
})