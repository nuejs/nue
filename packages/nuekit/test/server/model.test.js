
import { testDir, writeAll, removeAll } from '../test-utils'
import { createEnv } from '../../src/server/model'


afterAll(async () => await removeAll())


test('createEnv', async () => {
  await writeAll([
    ['users.json', '[{ "name": "John" }]'],
    ['leads.json', '[{ "name": "Jane" }]'],
  ])

  const { users, leads } = await createEnv(testDir)

  const [ john ] = await users.all()
  expect(john).toMatchObject({ id: 1, name: 'John' })

  expect((await leads.get(1))).toMatchObject({ id: 1, name: 'Jane' })

})


test('auth flow', async () => {
  await writeAll([
    ['users.json', '[{ "email": "hey@cc.com", "password": "test" }]']
  ])

  const { users } = await createEnv(testDir)

  const { sessionId } = await users.login('hey@cc.com', 'test')
  expect(sessionId.length).toBe(36)

  expect(await users.authenticate(sessionId)).toBeTrue()

  await users.logout(sessionId)
  expect(await users.authenticate(sessionId)).toBeFalse()

})

