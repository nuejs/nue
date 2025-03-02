# Nue.js Browser Tests

This directory contains tests for the browser version of Nue.js using domino to simulate a browser environment.

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

The tests focus on core Nue.js functionality:

- `refs.test.js`: Tests for the refs functionality

## Adding New Tests

To add a new test:

1. Create a new test file in this directory (e.g., `my-feature.test.js`)
2. Import the necessary utilities from `test-utils.js`
3. Write your tests using Bun's test API
4. Run the tests to verify they work

## Test Utilities

The `test-utils.js` file provides a utility to make testing easier:

- `mountComponentDirect(source, data, deps)`: Mounts a component directly from source string

## Example

```javascript
import { expect, test, describe } from 'bun:test'
import { mountComponentDirect } from './test-utils.js'

describe('My Feature Test', () => {
  test('my feature should work correctly', async () => {
    const source = `
      <div>
        <h1>{ title }</h1>
        <script>
          mounted() {
            this.title = 'Hello, World!'
          }
        </script>
      </div>
    `

    const { app, cleanup } = await mountComponentDirect(source)

    const h1 = app.$el.querySelector('h1')
    expect(h1.textContent).toBe('Hello, World!')

  })
})
```
