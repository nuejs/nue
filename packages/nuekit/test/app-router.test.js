
import { router, fire, fireRoute, parsePath, parseSearch } from '../src/browser/app-router.js'
global.location = { pathname: '', search: '' }

test('parse path', () => {
  router.setup('/app/:type/:id')
  expect(parsePath('/app/leads/389/bang')).toEqual({ type: 'leads', id: '389' })
  expect(parsePath('/app/users/89')).toEqual({ type: 'users', id: '89' })
  expect(parsePath('/foo/users')).toBeUndefined()
})

test('parse search', () => {
  router.setup('', ['start', 'length'])
  expect(parseSearch('?start=10&length=20&foo=bar')).toEqual({ start: '10', length: '20' })
})

test('fire', () => {
  router.setup('/:foo/:id', [])

  let count = 0

  router.on('foo', data => {
    expect(data).toEqual({ foo: 100 })
    count++
  })

  router.on('foo bar', data => {
    count++
  })

  router.set('foo', 100)
  router.set('foo', 100)
  router.set('bar', 100)
  expect(count).toEqual(3)
})


test('fire route', () => {
  router.setup('/:type/:id')
  let path_count = 0
  let id_count = 0

  router.on('type', data => {
    expect(data).toEqual({ type: "users", id: "100" })
    path_count++
  })

  router.on('id', data => id_count++)

  fireRoute('/users/100')
  fireRoute('/users/500')

  expect(path_count).toBe(1)
  expect(id_count).toBe(2)

})
