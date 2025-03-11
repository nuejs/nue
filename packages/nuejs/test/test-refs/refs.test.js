import { mkConfigBase, mountTestComponent } from '../test-utils.js'

const mkConfig = mkConfigBase(import.meta.url)


describe('Nue.js Refs Tests', () => {
  test('basic refs should work correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('basic-refs'))

    const input = app.$el.querySelector('input[name="email"]')
    expect(input.placeholder).toBe('Your email')
    expect(input.value).toBe('Hey')

    const h3 = app.$el.querySelector('h3')
    expect(h3.textContent.trim()).toBe('Ref: Your email')

    cleanup()
  })

  test('multiple refs should work correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('multiple-refs'))

    const username = app.$el.querySelector('input[name="username"]')
    const password = app.$el.querySelector('input[name="password"]')

    expect(username).toBeDefined()
    expect(password).toBeDefined()

    expect(username.value).toBe('admin')
    expect(password.value).toBe('secret')

    const message = app.$el.querySelector('p')
    expect(message.textContent).toBe('User: admin, Pass: secret')

    cleanup()
  })

  test('nested refs should work correctly', async () => {
    const { app, cleanup } = await mountTestComponent(mkConfig('nested-refs'))

    const container = app.$el.querySelector('[ref="container"]')
    const title = app.$el.querySelector('[ref="title"]')
    const content = app.$el.querySelector('[ref="content"]')

    expect(container).toBeDefined()
    expect(title).toBeDefined()
    expect(content).toBeDefined()

    // Get the paragraphs that display the reactive data
    const paragraphs = app.$el.querySelectorAll('p')
    const containerTagParagraph = paragraphs[1]
    const titleTextParagraph = paragraphs[2]

    expect(containerTagParagraph.textContent).toBe('Container tag: div')
    expect(titleTextParagraph.textContent).toBe('Title text: Nested Refs')

    cleanup()
  })
})
