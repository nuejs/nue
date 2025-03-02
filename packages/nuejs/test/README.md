# Nue.js Browser Tests

This directory contains tests for the browser version of Nue.js using domino to simulate a browser environment.

## Running the Tests

You can run the tests using Bun's built-in test runner:

```bash
# From the nuejs package directory
npm run test:browser

# Or directly with Bun
bun test test/browser/**/*.test.js --timeout 10000

# Run a specific test file
bun test test/browser/refs/index.test.js
```

## Test Structure

Each test has its own directory with the following files:

1. `component.dhtml` - Contains one or more component definitions in Nue.js format
2. `index.test.js` - The actual test file that imports and tests the components
3. `index.html` - An HTML file that can be used to render the components in a browser

The tests focus on core Nue.js functionality:

- `refs/` - Tests for the refs functionality

## Multiple Components in a Single File

Each `component.dhtml` file can contain multiple component definitions, similar to the client test files. This allows you to test related functionality together. For example:

```html
<div @name="basic-component">
  <!-- Basic component implementation -->
</div>

<div @name="advanced-component">
  <!-- Advanced component implementation -->
</div>
```

You can then test each component individually in your test file:

```javascript
test('basic component should work', async () => {
  const { app, cleanup } = await mountTestComponent('my-test', 'basic-component')
  // Test the basic component
  cleanup()
})

test('advanced component should work', async () => {
  const { app, cleanup } = await mountTestComponent('my-test', 'advanced-component')
  // Test the advanced component
  cleanup()
})
```

## Adding New Tests

To add a new test:

1. Create a new directory for your test (e.g., `my-feature/`)
2. Create a `component.dhtml` file with one or more component definitions
3. Create an `index.test.js` file that imports and tests the components
4. Create an `index.html` file to render the components in a browser
5. Run the compile script to generate the JS files: `bun run compile`
6. Run the tests to verify they work

## Test Utilities

The `test-utils.js` file provides utilities to make testing easier:

- `mountTestComponent(testName, componentName, data)`: Mounts a specific component from a test directory
- `getTestComponents(testName)`: Gets all component names from a test directory

## Example

```javascript
import { expect, test, describe } from 'bun:test'
import { mountTestComponent } from '../test-utils.js'

describe('My Feature Test', () => {
  test('first component should work correctly', async () => {
    const { app, cleanup } = await mountTestComponent('my-feature', 'first-component')
    // Test the first component
    cleanup()
  })

  test('second component should work correctly', async () => {
    const { app, cleanup } = await mountTestComponent('my-feature', 'second-component')
    // Test the second component
    cleanup()
  })
})
```
