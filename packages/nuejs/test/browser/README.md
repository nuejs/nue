# Nue.js Browser Tests

This directory contains tests for the browser version of Nue.js using happy-dom to simulate a browser environment.

## Running the Tests

You can run the tests using Bun's built-in test runner:

```bash
# From the nuejs package directory
npm run test:browser

# Or directly with Bun
bun test test/browser/*.test.js

# Run a specific test file
bun test test/browser/refs.test.js
```

## Test Structure

The tests are organized by functionality:

- `refs.test.js`: Tests for the refs functionality
- `basics.test.js`: Tests for basic Nue.js functionality (refs, conditionals, slots)
- `loops.test.js`: Tests for loop functionality
- `expressions.test.js`: Tests for expression rendering
- `attributes.test.js`: Tests for attribute binding

## Adding New Tests

To add a new test:

1. Create a new test file in this directory (e.g., `my-feature.test.js`)
2. Import the necessary utilities from `test-utils.js`
3. Write your tests using Bun's test API
4. Run the tests to verify they work

## Test Utilities

The `test-utils.js` file provides several utilities to make testing easier:

- `createBrowserEnv()`: Creates a simulated browser environment using happy-dom
- `createComponent(template, name, scriptContent)`: Creates a component from a template string
- `loadNueJs(window)`: Loads the Nue.js library into the window
- `mountComponent(window, document, component, data, deps)`: Mounts a component to the document

## Example

```javascript
import { expect, test, describe, beforeEach } from 'bun:test'
import { createBrowserEnv, createComponent, loadNueJs, mountComponent } from './test-utils.js'

describe('My Feature Test', () => {
  let env

  beforeEach(() => {
    env = createBrowserEnv()
    loadNueJs(env.window)
  })

  test('my feature should work correctly', () => {
    const template = `
      <div>
        <h1>{ title }</h1>
      </div>
    `

    const component = createComponent(template, 'my-component', {
      title: 'Hello, World!',
    })

    const app = mountComponent(env.window, env.document, component)

    const h1 = app.$el.querySelector('h1')
    expect(h1.textContent).toBe('Hello, World!')
  })
})
```
