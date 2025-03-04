import { expect, test, describe } from 'bun:test'
import { mountTestComponent } from '../test-utils.js'

const mkConfig = componentName => ({ testName: __dirname, componentName })

describe('Nue.js Ifs Tests', () => {
  test('The first if statement should conditional render correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-if'))

    const div = app.$el.querySelector('.first')
    expect(div.textContent).toBe('if')

    const div2 = app.$el.querySelector('.second')
    expect(div2).toBeUndefined()

    const div3 = app.$el.querySelector('.third')
    expect(div3).toBeUndefined()

    cleanup()
  })
})
