import { expect, test, describe, beforeEach } from 'bun:test'
import { createBrowserEnv, createComponent, loadNueJs, mountComponent } from './test-utils.js'

describe('Nue.js Basics Tests', () => {
  let env

  beforeEach(() => {
    env = createBrowserEnv()
    loadNueJs(env.window)
  })

  test('refs-test component should set and access refs correctly', () => {
    // Create a test component similar to the refs-test in basics.dhtml
    const template = `
      <div>
        <h3>
          Ref: { $refs.email.placeholder }
        </h3>
        <input name="email" placeholder="Your email">
      </div>
    `

    // Create the component with the mounted lifecycle method
    const component = createComponent(template, 'refs-test', {
      mounted(args) {
        args.$refs.email.value = 'Hey'
      },
    })

    // Mount the component
    const app = mountComponent(env.window, env.document, component)

    // Check that the ref was set correctly
    expect(app.$refs.email).toBeDefined()
    expect(app.$refs.email.value).toBe('Hey')
    expect(app.$refs.email.placeholder).toBe('Your email')

    // Check that the h3 content was rendered correctly
    const h3 = app.$el.querySelector('h3')
    expect(h3.textContent.trim()).toBe('Ref: Your email')
  })

  test('if-test component should conditionally render elements', () => {
    // Create a test component similar to the if-test in basics.dhtml
    const template = `
      <div>
        <h2>Count: { count }</h2>
        <p>
          <img :if="!count" class="icon" src="img/box.svg">
          <img :else-if="count % 2 == 0" class="icon" src="img/spray.svg">
          <img :else class="icon" src="img/pin.svg">
        </p>
        <p>
          <button @click="toggle" :if="!flag">Set flag</button>
          <button @click="toggle" :else>Unset</button>
        </p>
        <div :if="flag">
          <h3>{ item.title }</h3>
          <p>{ item.desc }</p>
        </div>
      </div>
    `

    // Create the component with the necessary data and methods
    const component = createComponent(template, 'if-test', {
      item: { title: 'Item title', desc: 'Item desc' },
      count: 0,
      flag: false,

      toggle() {
        this.flag = !this.flag
        this.count++
      },
    })

    // Mount the component
    const app = mountComponent(env.window, env.document, component)

    // Initial state: count = 0, flag = false
    expect(app.impl.count).toBe(0)
    expect(app.impl.flag).toBe(false)

    // Check that the first image is visible (count = 0)
    let images = app.$el.querySelectorAll('img')
    expect(images.length).toBe(1)
    expect(images[0].getAttribute('src')).toBe('img/box.svg')

    // Check that the "Set flag" button is visible
    let buttons = app.$el.querySelectorAll('button')
    expect(buttons.length).toBe(1)
    expect(buttons[0].textContent).toBe('Set flag')

    // Check that the conditional div is not visible
    let conditionalDiv = app.$el.querySelector('div > div')
    expect(conditionalDiv).toBeNull()

    // Click the button to toggle the flag and increment the count
    buttons[0].click()

    // After click: count = 1, flag = true
    expect(app.impl.count).toBe(1)
    expect(app.impl.flag).toBe(true)

    // Check that the third image is now visible (count = 1, odd)
    images = app.$el.querySelectorAll('img')
    expect(images.length).toBe(1)
    expect(images[0].getAttribute('src')).toBe('img/pin.svg')

    // Check that the "Unset" button is now visible
    buttons = app.$el.querySelectorAll('button')
    expect(buttons.length).toBe(1)
    expect(buttons[0].textContent).toBe('Unset')

    // Check that the conditional div is now visible
    conditionalDiv = app.$el.querySelector('div > div')
    expect(conditionalDiv).not.toBeNull()
    expect(conditionalDiv.querySelector('h3').textContent).toBe('Item title')
    expect(conditionalDiv.querySelector('p').textContent).toBe('Item desc')
  })

  test('slot-test component should render slots correctly', () => {
    // First, create the media component that will receive the slot content
    const mediaTemplate = `
      <div>
        <img :if="img" :src="img" class="icon">
        <aside>
          <h3>{ title || 'Default title'}</h3>
          <p>{ desc || 'Default desc'}</p>
          <slot />
        </aside>
      </div>
    `

    const mediaComponent = createComponent(mediaTemplate, 'media')

    // Now create the slot-test component
    const slotTestTemplate = `
      <div>
        <media :bind="item" desc="Desc override">
          <h2>${price}.00</h2>
          <button @click="buy" :hidden="bought">Add to bag</button>
          <b :if="bought" class="tag">🛒 In the bag</b>
        </media>
      </div>
    `

    // Create the component with the necessary data and methods
    const slotTestComponent = createComponent(slotTestTemplate, 'slot-test', {
      item: { title: 'Item title', desc: 'Item desc', img: 'img/paint.svg' },
      price: 50,
      bought: false,

      buy() {
        this.bought = true
      },
    })

    // Mount the component with the media component as a dependency
    const app = mountComponent(env.window, env.document, slotTestComponent, {}, [mediaComponent])

    // Check that the media component rendered correctly
    const mediaEl = app.$el.querySelector('media')
    expect(mediaEl).not.toBeNull()

    // Check that the slot content was rendered
    const h2 = app.$el.querySelector('h2')
    expect(h2).not.toBeNull()
    expect(h2.textContent).toBe('50.00')

    // Check that the button is visible and the tag is not
    const button = app.$el.querySelector('button')
    expect(button).not.toBeNull()
    expect(button.hidden).toBe(false)

    const tag = app.$el.querySelector('b.tag')
    expect(tag).toBeNull()

    // Click the button to buy
    button.click()

    // Check that the button is now hidden and the tag is visible
    expect(button.hidden).toBe(true)

    const tagAfterClick = app.$el.querySelector('b.tag')
    expect(tagAfterClick).not.toBeNull()
    expect(tagAfterClick.textContent).toBe('🛒 In the bag')
  })
})
