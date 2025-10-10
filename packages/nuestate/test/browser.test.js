import { test, expect, mock } from 'bun:test'
import { state } from '../src/state.js'

global.sessionStorage = {}
global.localStorage = {}
global.window = {}

test.skip('click flow', () => {

  // capture handler
  let clickHandler
  const addEventListener = mock((event, handler) => {
    if (event == 'click') clickHandler = handler
  })

  // click
  function click(pathname) {
    clickHandler({
      target: { closest: () => ({ pathname }) },
      preventDefault: mock()
    })
  }

  // mockups
  global.document = { addEventListener }
  global.location = { pathname: '/app', search: '' }
  global.history = { pushState: (state, _, path) => location.pathname = path }

  state.setup({ route: '/app/:view/:id', autolink: true })

  let count = 0

  state.on('view id', () => count++)

  // click
  click('/app/users/123')
  expect(state.view).toBe('users')
  expect(state.data).toMatchObject({ view: 'users', id: 123 })
  expect(count).toBe(1)


  // same click -> no change
  click('/app/users/123')
  expect(count).toBe(1)

  // non-matching click -> ignore
  click('/other/path')
  expect(count).toBe(1)
  expect(state.view).toBe('users')

  // id change
  state.id = 100
  expect(location.pathname).toBe('/app/users/100')
  expect(count).toBe(1)

  // view change
  state.view = 'leads'
  expect(location.pathname).toBe('/app/leads/100')
  expect(state.data).toEqual({ view: 'leads', id: 100 })
  expect(count).toBe(3)

  // truncate id
  click('/app/leads/')
  expect(count).toBe(4)
  expect(state.data).toEqual({ view: 'leads' })


})


test.skip('back button', () => {
  let popstateHandler

  const addEventListener = mock((event, handler) => {
    if (event == 'popstate') popstateHandler = handler
  })

  global.addEventListener = addEventListener
  global.location = { pathname: '/app/users/123', search: '?expand=true' }
  global.history  = { pushState: mock() }

  state.setup({ route: '/app/:view/:id', query: ['expand'] })

  expect(state.data).toEqual({ view: 'users', id: 123, expand: 'true' })

  // simulate popstate with valid history state
  location.pathname = '/app/users/126'
  location.search = ''
  popstateHandler({ state: { pathname: location.pathname } })

  expect(state.data).toEqual({ view: 'users', id: 126 })
})

