# Nue.js Tests

This directory contains tests for the Nue.js using [domino](https://github.com/fgnass/domino) to simulate a browser environment.

## Running the Tests

You can run the tests using Bun's built-in test runner:

```bash
# Go to nuejs package directory
cd packages/nuejs

# Run all nuejs tests
bun test

# Or, run a specific test suite
bun test test/test-clicks
```

## Test Structure

Each test has its own directory (with a name starting with `test-`) with the following files:

1. `component.dhtml` — Contains one or more `.dhtml` Nue.js components
2. `<test-name>.test.js` — The actual test file that imports the components and tests them
3. `index.html` — An HTML file that can be used to render the components in a browser

## Adding New Tests

To add a new test:

1. Create a new directory for your test (e.g. `test-my-feature/`)
2. Create a `component.dhtml` file with one or more component definitions
3. Create a `my-feature.test.js` file that imports and tests the components
4. Create an `index.html` file to render the components in a browser

## Test Utilities

The `test-utils.js` file provides utilities to make testing easier:

- `mkConfigBase(import.meta.url)`: Creates a function to build a config for the current test directory
  - Returns: `(componentName, data) => ({ testPath: currentDir, componentName, data })` where data is optional

- `mountTestComponent({ testName, componentName, data })`: Mounts a specific component from a test directory
  - `testPath`: Path to the test directory
  - `componentName`: Name of the component to mount
  - `data`: Optional data object to initialize the component with
  - Returns: `{ app, cleanup }` where `app` is the mounted component instance and `cleanup` is a function to clean up the test environment
