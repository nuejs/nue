import { expect, test, describe, beforeEach } from 'bun:test'
import { createBrowserEnv, createComponent, loadNueJs, mountComponent } from './test-utils.js'

describe('Nue.js Loops Tests', () => {
  let env

  beforeEach(() => {
    env = createBrowserEnv()
    loadNueJs(env.window)
  })

  test('basic for loop should render list items', () => {
    // Create a test component with a simple for loop
    const template = `
      <div>
        <ul>
          <li :for="item in items">{ item }</li>
        </ul>
      </div>
    `

    // Create the component with array data
    const component = createComponent(template, 'basic-loop', {
      items: ['Apple', 'Banana', 'Cherry'],
    })

    // Mount the component
    const app = mountComponent(env.window, env.document, component)

    // Check that the list items were rendered correctly
    const listItems = app.$el.querySelectorAll('li')
    expect(listItems.length).toBe(3)
    expect(listItems[0].textContent).toBe('Apple')
    expect(listItems[1].textContent).toBe('Banana')
    expect(listItems[2].textContent).toBe('Cherry')
  })

  test('loop with index should render indices correctly', () => {
    // Create a test component with a for loop that uses the index
    const template = `
      <div>
        <ul>
          <li :for="item, i in items">{ i }: { item }</li>
        </ul>
      </div>
    `

    // Create the component with array data
    const component = createComponent(template, 'index-loop', {
      items: ['Apple', 'Banana', 'Cherry'],
    })

    // Mount the component
    const app = mountComponent(env.window, env.document, component)

    // Check that the list items were rendered correctly with indices
    const listItems = app.$el.querySelectorAll('li')
    expect(listItems.length).toBe(3)
    expect(listItems[0].textContent).toBe('0: Apple')
    expect(listItems[1].textContent).toBe('1: Banana')
    expect(listItems[2].textContent).toBe('2: Cherry')
  })

  test('nested loops should render correctly', () => {
    // Create a test component with nested loops
    const template = `
      <div>
        <div :for="category in categories" class="category">
          <h3>{ category.name }</h3>
          <ul>
            <li :for="item in category.items">{ item }</li>
          </ul>
        </div>
      </div>
    `

    // Create the component with nested array data
    const component = createComponent(template, 'nested-loop', {
      categories: [
        { name: 'Fruits', items: ['Apple', 'Banana', 'Cherry'] },
        { name: 'Vegetables', items: ['Carrot', 'Broccoli'] },
      ],
    })

    // Mount the component
    const app = mountComponent(env.window, env.document, component)

    // Check that the categories were rendered correctly
    const categories = app.$el.querySelectorAll('.category')
    expect(categories.length).toBe(2)

    // Check the first category
    expect(categories[0].querySelector('h3').textContent).toBe('Fruits')
    const fruitItems = categories[0].querySelectorAll('li')
    expect(fruitItems.length).toBe(3)
    expect(fruitItems[0].textContent).toBe('Apple')
    expect(fruitItems[1].textContent).toBe('Banana')
    expect(fruitItems[2].textContent).toBe('Cherry')

    // Check the second category
    expect(categories[1].querySelector('h3').textContent).toBe('Vegetables')
    const vegItems = categories[1].querySelectorAll('li')
    expect(vegItems.length).toBe(2)
    expect(vegItems[0].textContent).toBe('Carrot')
    expect(vegItems[1].textContent).toBe('Broccoli')
  })

  test('object loop should render key-value pairs', () => {
    // Create a test component that loops over an object
    const template = `
      <div>
        <ul>
          <li :for="[key, value] in Object.entries(person)">{ key }: { value }</li>
        </ul>
      </div>
    `

    // Create the component with object data
    const component = createComponent(template, 'object-loop', {
      person: {
        name: 'John',
        age: 30,
        city: 'New York',
      },
    })

    // Mount the component
    const app = mountComponent(env.window, env.document, component)

    // Check that the object entries were rendered correctly
    const listItems = app.$el.querySelectorAll('li')
    expect(listItems.length).toBe(3)

    // The order of object entries is not guaranteed, so we'll check that all entries are present
    const textContents = Array.from(listItems).map(li => li.textContent)
    expect(textContents).toContain('name: John')
    expect(textContents).toContain('age: 30')
    expect(textContents).toContain('city: New York')
  })

  test('loop with reactivity should update when array changes', () => {
    // Create a test component with a for loop and methods to modify the array
    const template = `
      <div>
        <button @click="addItem">Add Item</button>
        <button @click="removeItem">Remove Item</button>
        <ul>
          <li :for="item in items">{ item }</li>
        </ul>
      </div>
    `

    // Create the component with array data and methods
    const component = createComponent(template, 'reactive-loop', {
      items: ['Apple', 'Banana'],

      addItem() {
        this.items.push('Cherry')
      },

      removeItem() {
        this.items.pop()
      },
    })

    // Mount the component
    const app = mountComponent(env.window, env.document, component)

    // Check initial state
    let listItems = app.$el.querySelectorAll('li')
    expect(listItems.length).toBe(2)
    expect(listItems[0].textContent).toBe('Apple')
    expect(listItems[1].textContent).toBe('Banana')

    // Click the "Add Item" button
    const addButton = app.$el.querySelectorAll('button')[0]
    addButton.click()

    // Check that the new item was added
    listItems = app.$el.querySelectorAll('li')
    expect(listItems.length).toBe(3)
    expect(listItems[2].textContent).toBe('Cherry')

    // Click the "Remove Item" button
    const removeButton = app.$el.querySelectorAll('button')[1]
    removeButton.click()

    // Check that the last item was removed
    listItems = app.$el.querySelectorAll('li')
    expect(listItems.length).toBe(2)
    expect(listItems[0].textContent).toBe('Apple')
    expect(listItems[1].textContent).toBe('Banana')
  })
})
