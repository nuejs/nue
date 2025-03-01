import { expect, test, describe, beforeEach } from 'bun:test'
import { createBrowserEnv, createComponent, loadNueJs, mountComponent } from './test-utils.js'

describe('Nue.js Expression Tests', () => {
  let env

  beforeEach(() => {
    env = createBrowserEnv()
    loadNueJs(env.window)
  })

  test('simple expressions should render correctly', () => {
    const template = `
      <div>
        <h1>{ title }</h1>
        <p>{ description }</p>
      </div>
    `

    const component = createComponent(template, 'expression-test', {
      title: 'Hello, World!',
      description: 'This is a test',
    })

    const app = mountComponent(env.window, env.document, component)

    const h1 = app.$el.querySelector('h1')
    const p = app.$el.querySelector('p')

    expect(h1.textContent).toBe('Hello, World!')
    expect(p.textContent).toBe('This is a test')
  })

  test('expressions with operations should render correctly', () => {
    const template = `
      <div>
        <p>Sum: { a + b }</p>
        <p>Product: { a * b }</p>
        <p>Concatenation: { firstName + ' ' + lastName }</p>
      </div>
    `

    const component = createComponent(template, 'operation-test', {
      a: 5,
      b: 10,
      firstName: 'John',
      lastName: 'Doe',
    })

    const app = mountComponent(env.window, env.document, component)

    const paragraphs = app.$el.querySelectorAll('p')

    expect(paragraphs[0].textContent).toBe('Sum: 15')
    expect(paragraphs[1].textContent).toBe('Product: 50')
    expect(paragraphs[2].textContent).toBe('Concatenation: John Doe')
  })

  test('expressions with method calls should render correctly', () => {
    const template = `
      <div>
        <p>Uppercase: { toUpperCase(text) }</p>
        <p>Formatted: { formatNumber(value) }</p>
      </div>
    `

    const component = createComponent(template, 'method-test', {
      text: 'hello world',
      value: 1234.56,

      toUpperCase(str) {
        return str.toUpperCase()
      },

      formatNumber(num) {
        return num.toFixed(2)
      },
    })

    const app = mountComponent(env.window, env.document, component)

    const paragraphs = app.$el.querySelectorAll('p')

    expect(paragraphs[0].textContent).toBe('Uppercase: HELLO WORLD')
    expect(paragraphs[1].textContent).toBe('Formatted: 1234.56')
  })

  test('expressions should update reactively', () => {
    const template = `
      <div>
        <p>Count: { count }</p>
        <p>Double: { count * 2 }</p>
        <button @click="increment">Increment</button>
      </div>
    `

    const component = createComponent(template, 'reactive-test', {
      count: 1,

      increment() {
        this.count++
      },
    })

    const app = mountComponent(env.window, env.document, component)

    // Initial state
    const paragraphs = app.$el.querySelectorAll('p')
    expect(paragraphs[0].textContent).toBe('Count: 1')
    expect(paragraphs[1].textContent).toBe('Double: 2')

    // Click the button to increment the count
    const button = app.$el.querySelector('button')
    button.click()

    // Check that the expressions updated
    expect(paragraphs[0].textContent).toBe('Count: 2')
    expect(paragraphs[1].textContent).toBe('Double: 4')

    // Click again
    button.click()

    // Check that the expressions updated again
    expect(paragraphs[0].textContent).toBe('Count: 3')
    expect(paragraphs[1].textContent).toBe('Double: 6')
  })

  test('conditional expressions should render correctly', () => {
    const template = `
      <div>
        <p>Status: { isActive ? 'Active' : 'Inactive' }</p>
        <p>Temperature: { temperature > 30 ? 'Hot' : temperature > 20 ? 'Warm' : 'Cold' }</p>
        <button @click="toggle">Toggle</button>
      </div>
    `

    const component = createComponent(template, 'conditional-test', {
      isActive: true,
      temperature: 25,

      toggle() {
        this.isActive = !this.isActive
        this.temperature = this.isActive ? 35 : 15
      },
    })

    const app = mountComponent(env.window, env.document, component)

    // Initial state
    const paragraphs = app.$el.querySelectorAll('p')
    expect(paragraphs[0].textContent).toBe('Status: Active')
    expect(paragraphs[1].textContent).toBe('Temperature: Warm')

    // Click the button to toggle the state
    const button = app.$el.querySelector('button')
    button.click()

    // Check that the expressions updated
    expect(paragraphs[0].textContent).toBe('Status: Inactive')
    expect(paragraphs[1].textContent).toBe('Temperature: Cold')

    // Click again
    button.click()

    // Check that the expressions updated again
    expect(paragraphs[0].textContent).toBe('Status: Active')
    expect(paragraphs[1].textContent).toBe('Temperature: Hot')
  })
})
