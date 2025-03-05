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

  test('The else-if statement should conditional render correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-else-if'))

    const div = app.$el.querySelector('.first')
    expect(div).toBeUndefined()

    const div2 = app.$el.querySelector('.second')
    expect(div2.textContent).toBe('else-if')

    const div3 = app.$el.querySelector('.third')
    expect(div3).toBeUndefined()

    cleanup()
  })

  test('The else statement should conditional render correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-else'))

    const div = app.$el.querySelector('.first')
    expect(div).toBeUndefined()

    const div2 = app.$el.querySelector('.second')
    expect(div2).toBeUndefined()

    const div3 = app.$el.querySelector('.third')
    expect(div3.textContent).toBe('else')

    cleanup()
  })

  test('If-else should render if branch when condition is true', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-if-and-else-true'))

    const div = app.$el.querySelector('.first')
    expect(div.textContent).toBe('visible')

    const div2 = app.$el.querySelector('.second')
    expect(div2).toBeUndefined()

    cleanup()
  })

  test('If-else should render else branch when condition is false', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-if-and-else-false'))

    const div = app.$el.querySelector('.first')
    expect(div).toBeUndefined()

    const div2 = app.$el.querySelector('.second')
    expect(div2.textContent).toBe('visible')

    cleanup()
  })

  test('Multiple independent if statements should render correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-if-only'))

    const div = app.$el.querySelector('.first')
    expect(div.textContent).toBe('visible')

    const div2 = app.$el.querySelector('.second')
    expect(div2).toBeUndefined()

    cleanup()
  })

  test('Nested if statements should render correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('test-nested-if'))

    const div2 = app.$el.querySelector('.nested')
    expect(div2.textContent).toBe('visible')

    cleanup()
  })
})
