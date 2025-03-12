import { mkConfigBase, mountTestComponent } from '../test-utils.js'

const mkConfig = mkConfigBase(import.meta.url)

describe('Nue.js Fors Tests', () => {
  test('Array', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array'))

    const list = Array.from(app.$el.querySelectorAll('li')).map(e => e.textContent)
    expect(list).toEqual(['hello', 'world', '42'])

    cleanup()
  })

  test('Numbered Array', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array-numbered'))

    const list = Array.from(app.$el.querySelectorAll('li')).map(e => e.textContent)
    expect(list).toEqual(['0: hello', '1: world', '2: 42'])

    cleanup()
  })

  test('Object Array', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-object-array'))

    const list = Array.from(app.$el.querySelectorAll('li')).map(e => e.textContent)
    expect(list).toEqual(['hello', 'world', '42'])

    cleanup()
  })

  test('Array funcs', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array-funcs'))
    const arr = () => Array.from(app.$el.querySelectorAll('li')).map(e => e.textContent)

    expect(arr()).toEqual(['hello', 'world'])

    app.$refs.push.click()
    app.$refs.push.click()
    expect(arr()).toEqual(['hello', 'world', '42', '42'])

    app.$refs.pop.click()
    expect(arr()).toEqual(['hello', 'world', '42'])

    app.$refs.unshift.click()
    app.$refs.unshift.click()
    expect(arr()).toEqual(['answer', 'answer', 'hello', 'world', '42'])

    app.$refs.shift.click()
    expect(arr()).toEqual(['answer', 'hello', 'world', '42'])

    app.$refs.reverse.click()
    expect(arr()).toEqual(['42', 'world', 'hello', 'answer'])

    app.$refs.remove.click()
    expect(arr()).toEqual([ '42', 'world', 'answer'])

    app.$refs.splice.click()
    expect(arr()).toEqual(['42', 'answer'])

    app.$refs.push.click() // additional 42 at end for sort
    app.$refs.sort.click()
    expect(arr()).toEqual(['42', '42', 'answer'])

    cleanup()
  })
})
