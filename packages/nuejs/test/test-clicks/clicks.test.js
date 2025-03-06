import { mkConfigBase, mountTestComponent } from '../test-utils.js'

const mkConfig = mkConfigBase(import.meta.url)


describe('Nue.js Clicks Tests', () => {
  test('basic click events should update the DOM correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('basic-clicks'))

    const h3 = app.$el.querySelector('h3')
    expect(h3.textContent.trim()).toBe('Count: 0')

    const button = app.$el.querySelector('button')
    button.click()

    expect(h3.textContent.trim()).toBe('Count: 1')

    cleanup()
  })
})
