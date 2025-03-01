import { expect, test, describe, beforeEach } from 'bun:test'
import { createBrowserEnv, createComponent, loadNueJs, mountComponent } from './test-utils.js'

describe('Nue.js Attribute Binding Tests', () => {
  let env

  beforeEach(() => {
    env = createBrowserEnv()
    loadNueJs(env.window)
  })

  test('static attributes should be set correctly', () => {
    const template = `
      <div>
        <a href="https://example.com" target="_blank" rel="noopener">Link</a>
        <img src="image.jpg" alt="An image" width="100" height="100">
      </div>
    `

    const component = createComponent(template, 'static-attr-test')
    const app = mountComponent(env.window, env.document, component)

    const link = app.$el.querySelector('a')
    expect(link.getAttribute('href')).toBe('https://example.com')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener')

    const img = app.$el.querySelector('img')
    expect(img.getAttribute('src')).toBe('image.jpg')
    expect(img.getAttribute('alt')).toBe('An image')
    expect(img.getAttribute('width')).toBe('100')
    expect(img.getAttribute('height')).toBe('100')
  })

  test('dynamic attributes should be bound correctly', () => {
    const template = `
      <div>
        <a :href="url" :target="target">Link</a>
        <img :src="imageSrc" :alt="imageAlt" :width="imageWidth" :height="imageHeight">
      </div>
    `

    const component = createComponent(template, 'dynamic-attr-test', {
      url: 'https://example.com',
      target: '_blank',
      imageSrc: 'image.jpg',
      imageAlt: 'An image',
      imageWidth: 100,
      imageHeight: 100,
    })

    const app = mountComponent(env.window, env.document, component)

    const link = app.$el.querySelector('a')
    expect(link.getAttribute('href')).toBe('https://example.com')
    expect(link.getAttribute('target')).toBe('_blank')

    const img = app.$el.querySelector('img')
    expect(img.getAttribute('src')).toBe('image.jpg')
    expect(img.getAttribute('alt')).toBe('An image')
    expect(img.getAttribute('width')).toBe('100')
    expect(img.getAttribute('height')).toBe('100')
  })

  test('attribute binding should update reactively', () => {
    const template = `
      <div>
        <a :href="url">Link</a>
        <button @click="changeUrl">Change URL</button>
      </div>
    `

    const component = createComponent(template, 'reactive-attr-test', {
      url: 'https://example.com',

      changeUrl() {
        this.url = 'https://nuejs.org'
      },
    })

    const app = mountComponent(env.window, env.document, component)

    // Initial state
    const link = app.$el.querySelector('a')
    expect(link.getAttribute('href')).toBe('https://example.com')

    // Click the button to change the URL
    const button = app.$el.querySelector('button')
    button.click()

    // Check that the attribute updated
    expect(link.getAttribute('href')).toBe('https://nuejs.org')
  })

  test('class binding should work correctly', () => {
    const template = `
      <div>
        <div :class="['base', { active: isActive, disabled: isDisabled }]">Element</div>
        <button @click="toggle">Toggle</button>
      </div>
    `

    const component = createComponent(template, 'class-binding-test', {
      isActive: true,
      isDisabled: false,

      toggle() {
        this.isActive = !this.isActive
        this.isDisabled = !this.isDisabled
      },
    })

    const app = mountComponent(env.window, env.document, component)

    // Initial state
    const element = app.$el.querySelector('div > div')
    expect(element.getAttribute('class')).toBe('base active')

    // Click the button to toggle the classes
    const button = app.$el.querySelector('button')
    button.click()

    // Check that the classes updated
    expect(element.getAttribute('class')).toBe('base disabled')
  })

  test('style binding should work correctly', () => {
    const template = `
      <div>
        <div :style="{ color: textColor, 'font-size': fontSize + 'px', backgroundColor }">Styled Element</div>
        <button @click="changeStyle">Change Style</button>
      </div>
    `

    const component = createComponent(template, 'style-binding-test', {
      textColor: 'red',
      fontSize: 16,
      backgroundColor: 'lightblue',

      changeStyle() {
        this.textColor = 'blue'
        this.fontSize = 20
        this.backgroundColor = 'lightgreen'
      },
    })

    const app = mountComponent(env.window, env.document, component)

    // Initial state
    const element = app.$el.querySelector('div > div')
    expect(element.style.color).toBe('red')
    expect(element.style.fontSize).toBe('16px')
    expect(element.style.backgroundColor).toBe('lightblue')

    // Click the button to change the style
    const button = app.$el.querySelector('button')
    button.click()

    // Check that the style updated
    expect(element.style.color).toBe('blue')
    expect(element.style.fontSize).toBe('20px')
    expect(element.style.backgroundColor).toBe('lightgreen')
  })

  test('boolean attributes should work correctly', () => {
    const template = `
      <div>
        <input type="checkbox" $checked="isChecked">
        <button $disabled="isDisabled">Button</button>
        <button @click="toggle">Toggle</button>
      </div>
    `

    const component = createComponent(template, 'boolean-attr-test', {
      isChecked: true,
      isDisabled: false,

      toggle() {
        this.isChecked = !this.isChecked
        this.isDisabled = !this.isDisabled
      },
    })

    const app = mountComponent(env.window, env.document, component)

    // Initial state
    const checkbox = app.$el.querySelector('input')
    const disabledButton = app.$el.querySelector('button[disabled]')

    expect(checkbox.checked).toBe(true)
    expect(disabledButton).toBeNull()

    // Click the button to toggle the boolean attributes
    const toggleButton = app.$el.querySelectorAll('button')[1]
    toggleButton.click()

    // Check that the boolean attributes updated
    expect(checkbox.checked).toBe(false)
    expect(app.$el.querySelector('button[disabled]')).not.toBeNull()
  })
})
