
import { unlinkSync, existsSync } from 'fs'
import { createKV } from '../../src/server/kv.js'

const testKvPath = './test-kv.json'

beforeEach(() => {
 if (existsSync(testKvPath)) {
   unlinkSync(testKvPath)
 }
})

afterEach(() => {
 if (existsSync(testKvPath)) {
   unlinkSync(testKvPath)
 }
})

test('put and get strings', async () => {
 const kv = createKV()
 await kv.put('name', 'John')
 expect(await kv.get('name')).toBe('John')
})

test('put and get objects', async () => {
 const kv = createKV()
 const user = { id: 1, name: 'Jane' }
 await kv.put('user', user)
 expect(await kv.get('user', { type: 'json' })).toEqual(user)
})

test('get non-existent key', async () => {
 const kv = createKV()
 expect(await kv.get('missing')).toBe(null)
})

test('numbers get stringified', async () => {
 const kv = createKV()
 await kv.put('count', 42)
 expect(await kv.get('count')).toBe('42')
})

test('delete existing key', async () => {
 const kv = createKV()
 await kv.put('temp', 'value')
 expect(await kv.delete('temp')).toBe(true)
 expect(await kv.get('temp')).toBe(null)
})

test('delete non-existent key', async () => {
 const kv = createKV()
 expect(await kv.delete('missing')).toBe(false)
})

test('list all keys', async () => {
 const kv = createKV()
 await kv.put('a', '1')
 await kv.put('b', '2')

 const result = await kv.list()
 expect(result.keys.length).toBe(2)
 expect(result.list_complete).toBe(true)
 expect(result.cursor).toBe(null)
})

test('list with prefix filter', async () => {
 const kv = createKV()
 await kv.put('test1', 'a')
 await kv.put('test2', 'b')
 await kv.put('other', 'c')

 const result = await kv.list({ prefix: 'test' })
 expect(result.keys.length).toBe(2)
 expect(result.keys.map(k => k.name)).toEqual(['test1', 'test2'])
})

test('list with limit', async () => {
 const kv = createKV()
 await kv.put('a', '1')
 await kv.put('b', '2')
 await kv.put('c', '3')

 const result = await kv.list({ limit: 2 })
 expect(result.keys.length).toBe(2)
})

test('persistence', async () => {
 const kv1 = createKV(testKvPath)
 await kv1.put('persistent', 'data')

 const kv2 = createKV(testKvPath)
 await new Promise(resolve => setTimeout(resolve, 10))
 
 expect(await kv2.get('persistent')).toBe('data')
})