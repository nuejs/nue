
import { getPathData, getQueryData, renderPath, renderQuery, api, state } from '../src/state.js'


describe('internal methods', () => {

  test('get path data', () => {
    const route = '/app/:type/:id'
    expect(getPathData(route, '/app/leads/389/bang')).toEqual({ type: 'leads', id: '389' })
    expect(getPathData(route, '/app/users/89')).toEqual({ type: 'users', id: '89' })
    expect(getPathData(route, '/admin/users')).toBeUndefined()
  })


  test('get query data', () => {
    const params = ['start', 'length']
    expect(getQueryData(params, '?start=10&length=20&foo=bar'))
      .toEqual({ start: '10', length: '20' })
  })

  test('renderPath', () => {
    const route = '/app/:view/:id'
    expect(renderPath(route, {})).toBe('/app/')
    expect(renderPath(route, { id: 100 })).toBe('/app/')
    expect(renderPath(route, { view: 'people', id: null })).toBe('/app/people/')
    expect(renderPath(route, { view: 'people', id: 30 })).toBe('/app/people/30')
  })


  test('renderQuery', () => {
    const data = { q: 'john', start: 10, foo: 1 }
    expect(renderQuery(['q', 'start'], data)).toBe('?q=john&start=10')
    expect(renderQuery([], data)).toBe('')
  })

})

describe('event emitting', () => {

  beforeEach(() => api.clear())

  test('on', () => {
    api.setup({ memory: ['foo', 'bar'] })

    let count = 0
    api.on('foo', () => count++)
    api.on('foo bar', () => count++)
    api.on('bar', () => count++)

    api.set({ foo: true })
    api.set({ bar: true })

    expect(count).toBe(4)
    expect(api.data).toEqual({ foo: true, bar: true })
  })

  test('duplicates', () => {
    api.setup({ memory: ['foo'] })

    let count = 0
    api.on('foo', () => count++)
    api.on('foo', () => count++)
    api.on('foo bar', () => count++)

    api.set({ foo: true })
    api.set({ foo: true })

    expect(count).toBe(2)
  })

  test('emit', () => {
    api.setup({ emit_only: ['foo'] })

    let count = 0
    api.on('foo', () => count++)
    api.set({ foo: true })

    expect(count).toBe(1)
  })

  test('batch', () => {
    api.setup({ memory: ['foo', 'bar'] })

    let count = 0
    api.on('foo bar', () => count++)
    api.set({ foo: true, bar: true })

    expect(count).toBe(1)
  })

  test('state', () => {
    state.setup({ emit_only: ['foo'], memory: ['bar'] })

    let count = 0
    state.on('foo', () => count++)
    state.foo = true
    state.bar = true
    state.on = false

    expect(count).toBe(1)
    expect(state.data).toEqual({ bar: true })
  })


})
