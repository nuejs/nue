import { expect, test, describe } from 'bun:test'
import { mountTestComponent } from './test-utils.js'

describe('Nue.js Refs Test', () => {
  test('component should set and access refs correctly', async () => {
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

    const { app, cleanup } = await mountTestComponent(source)

    const input = app.$el?.querySelector('input[name="email"]')
    expect(input).toBeDefined()
    expect(input.placeholder).toBe('Your email')
    expect(input.value).toBe('Hey')

    const h3 = app.$el.querySelector('h3')
    expect(h3.textContent.trim()).toBe('Ref: Your email')

    cleanup()
  })
})
