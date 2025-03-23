import { mkConfigBase, mountTestComponent } from '../test-utils.js'

const mkConfig = mkConfigBase(import.meta.url)
function arr(parent) { return Array.from(parent.querySelectorAll('li')).map(e => e.textContent) }


describe('Nue.js Fors Tests', () => {
  test('Array', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array'))

    expect(arr(app.$el)).toEqual(['hello', 'world', '42'])

    cleanup()
  })

  test('Unpacking Array', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array-unpack'))

    expect(arr(app.$el)).toEqual(['hello', '42'])

    cleanup()
  })

  test('Numbered Array', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array-numbered'))

    expect(arr(app.$el)).toEqual(['0: hello', '1: world', '2: 42'])

    cleanup()
  })

  test('Object Array', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-object-array'))

    expect(arr(app.$el)).toEqual(['hello', 'world', '42'])

    cleanup()
  })

  test('Array replaced', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array-replace'))

    expect(arr(app.$el)).toEqual(['hello'])
    app.$el.querySelector('button').click()
    expect(arr(app.$el)).toEqual(['world'])

    cleanup()
  })

  test('Array funcs', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array-funcs'))

    expect(arr(app.$el)).toEqual(['hello', 'world'])

    app.$refs.push.click()
    app.$refs.push.click()
    expect(arr(app.$el)).toEqual(['hello', 'world', '42', '42'])

    app.$refs.pop.click()
    expect(arr(app.$el)).toEqual(['hello', 'world', '42'])

    app.$refs.unshift.click()
    app.$refs.unshift.click()
    expect(arr(app.$el)).toEqual(['answer', 'answer', 'hello', 'world', '42'])

    app.$refs.shift.click()
    expect(arr(app.$el)).toEqual(['answer', 'hello', 'world', '42'])

    app.$refs.reverse.click()
    expect(arr(app.$el)).toEqual(['42', 'world', 'hello', 'answer'])

    app.$refs.remove.click()
    expect(arr(app.$el)).toEqual(['42', 'world', 'answer'])

    app.$refs.splice.click()
    expect(arr(app.$el)).toEqual(['42', 'answer'])

    app.$refs.push.click() // additional 42 at end for sort
    app.$refs.sort.click()
    expect(arr(app.$el)).toEqual(['42', '42', 'answer'])

    cleanup()
  })
})
