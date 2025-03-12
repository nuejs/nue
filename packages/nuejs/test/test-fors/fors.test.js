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

  test('Array update', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-for-array-push'))

    const listA = Array.from(app.$el.querySelectorAll('li')).map(e => e.textContent)
    expect(listA).toEqual(['hello', 'world'])

    const button = app.$el.querySelector('button')
    button.click()
  
    const listB = Array.from(app.$el.querySelectorAll('li')).map(e => e.textContent)
    expect(listB).toEqual(['hello', 'world', '42'])

    cleanup()
  })
})
