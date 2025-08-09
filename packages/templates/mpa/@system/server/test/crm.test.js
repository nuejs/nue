
import { loadSchema } from '../data/load.js'
import { createCRM } from '../model/crm.js'
import { env } from './mock.js'

await loadSchema(env.DB)

// clear db before each test
beforeEach(async () => {
  await env.DB.exec(`DELETE FROM contacts; DELETE FROM sqlite_sequence`)
})

test('addContact', async () => {
  const crm = createCRM(env)

  const contact = await crm.addContact({
    email: 'john@example.com',
    country: 'FI'
  })

  expect(contact.id).toBe(1)

  const { results } = await crm.getContacts({})
  expect(results.length).toBe(1)
  expect(results[0].email).toBe('john@example.com')
})

test('getContacts - no params', async () => {
 const crm = createCRM(env)
 await crm.addContact({
   name: 'John Doe',
   email: 'john@example.com',
   country: 'US'
 })
 const { results } = await crm.getContacts({})
 expect(results.length).toBe(1)
 expect(results[0].name).toBe('John Doe')
})

test('getContacts - with query', async () => {
  const crm = createCRM(env)
  await crm.addContact({
    name: 'Jane Smith',
    email: 'jane@company.com',
    country: 'UK'
  })
  const { results } = await crm.getContacts({ query: 'jane' })
  expect(results.length).toBe(1)
  expect(results[0].name).toBe('Jane Smith')
})

test('getContacts - with pagination', async () => {
  const crm = createCRM(env)
  await crm.addContact({ name: 'Contact 1', email: 'c1@test.com', country: 'US' })
  await crm.addContact({ name: 'Contact 2', email: 'c2@test.com', country: 'US' })
  await crm.addContact({ name: 'Contact 3', email: 'c3@test.com', country: 'US' })

  const { results, count } = await crm.getContacts({ start: 1, length: 2 })
  expect(results.length).toBe(2)
  expect(count).toBe(3)
})

test('getContacts - type member', async () => {
  const crm = createCRM(env)
  await crm.addContact({ name: 'Regular Contact', email: 'regular@test.com', country: 'US' })
  await crm.addContact({ email: 'member@test.com', country: 'US' }) // no name -> "lead"

  const { results } = await crm.getContacts({ type: 'member' })
  expect(results.length).toBe(1)
  expect(results[0].name).toBeUndefined()
})

test('getContacts - type contacts', async () => {
  const crm = createCRM(env)
  await crm.addContact({ name: 'Regular Contact', email: 'regular@test.com', country: 'FI' })
  await crm.addContact({ email: 'member@test.com', country: 'FI' })

  const { results } = await crm.getContacts({ type: 'contact' })
  expect(results.length).toBe(1)
  expect(results[0].name).toBe('Regular Contact')
})