
import {
  router,
  parsePathData,
  parseQueryData,
  hasPathData,
  renderPath,
  matchesPath,
  renderQuery,
  cleanup,
  diff,
  fire

} from '../src/browser/app-router.js'

// browserify
global.history = null
global.sessionStorage = {}
global.localStorage = {}

// cleanup
beforeEach(() => cleanup())


test('parse path data', () => {
  router.configure({ route: '/app/:type/:id' })
  expect(parsePathData('/app/leads/389/bang')).toEqual({ type: 'leads', id: '389' })
  expect(parsePathData('/app/users/89')).toEqual({ type: 'users', id: '89' })
  expect(parsePathData('/foo/users')).toBeUndefined()
})

test('parse search', () => {
  router.configure({ url_params: ['start', 'length'] })
  expect(parseQueryData('?start=10&length=20&foo=bar')).toEqual({ start: '10', length: '20' })
})

test('hasPathData', () => {
  router.configure({ route: '/app/:foo/:bar' })
  expect(hasPathData({ foo: 10 })).toBeTrue()
  expect(hasPathData({ zappa: 10 })).toBeUndefined()
})

test('matchesPath', () => {
  router.configure({ route: '/app/:type' })

  expect(matchesPath('/something/else')).toBeFalse()
  expect(matchesPath('/app/zoo/2000')).toBeTrue()
})


test('diff', () => {
  const orig = { a: 1, b: 2, c: 3 }
  const data = { a: 1, b: 3, d: 4 }
  expect(diff(orig, data)).toEqual({ b: 3, c: null, d: 4 })
})


test('fire', () => {
  router.configure({ route: '/app/:foo/:id' })

  let count = 0

  router.on('foo', data => {
    // expect(data).toEqual({ foo: 100 })
    count++
  })

  router.on('foo bar', data => {
    count++
  })

  router.set({ foo: 100 })
  router.set({ foo: 100 })

  expect(count).toEqual(2)
})


test('renderPath', () => {
  router.configure({ route: '/app/:cat/:uid' })

  expect(renderPath()).toBe('/app/')

  router.set({ uid: 100 })
  expect(renderPath()).toBe('/app/')

  router.set({ cat: 'people', uid: null })
  expect(renderPath()).toBe('/app/people/')

  router.set({ cat: 'people', uid: 30 })
  expect(renderPath()).toBe('/app/people/30')
})


test('renderQuery', () => {
  router.configure({ url_params: ['query', 'start'] })
  router.set({ query: 'joe', start: 10 })
})

test('storage', () => {
  router.configure({ url_params: ['id'], session_params: ['sess'] })
  router.set({ sess: true, id: 100 })
  expect(router.state.sess).toBe(true)

  router.set({ sess: false })
  expect(router.state).toEqual({sess: false, id: 100 })

})