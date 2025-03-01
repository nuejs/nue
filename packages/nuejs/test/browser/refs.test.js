import { expect, test, describe, beforeEach } from 'bun:test'
import { createBrowserEnv, mountComponent } from './test-utils.js'
import { compile } from '../../index.js'

describe('Nue.js Refs Test', () => {
  let env

  beforeEach(() => {
    env = createBrowserEnv()
  })

  test('refs-test component should set and access refs correctly', async () => {
    const source = `
      <div @name="refs-test">
        <h3>
          Ref: { $refs.email.placeholder }
        </h3>
        <input name="email" placeholder="Your email">

        <script>
          mounted() {
            this.$refs.email.value = 'Hey'
          }
        </script>
      </div>
    `

    // Compile the component using the actual compiler
    const [component, ...deps] = compile(source)

    // Mount the component
    const { app, cleanup } = await mountComponent(env.window, env.document, component)

    // Run assertions
    expect(app.$refs.email).toBeDefined()
    expect(app.$refs.email.value).toBe('Hey')
    expect(app.$refs.email.placeholder).toBe('Your email')

    const h3 = app.$el.querySelector('h3')
    expect(h3.textContent.trim()).toBe('Ref: Your email')

    // Cleanup after test
    cleanup()
  })
})
