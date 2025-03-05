import { createWindow } from 'domino'
import { parse } from '../src/compile.js'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Mounts a component from a test directory
 * @param {Object} options - Mount options
 * @param {string} options.testName - The name of the test directory
 * @param {string} options.componentName - Name of the specific component to mount
 * @param {Object} [options.data={}] - Data to initialize the component with
 */
export async function mountTestComponent({ testName, componentName, data = {} }) {
  // Validate inputs
  if (!testName || !componentName) {
    throw new Error('Required parameters missing: testName and componentName must be provided')
  }

  // Setup domino DOM environment
  const window = createWindow('<!DOCTYPE html><html><body></body></html>')
  const document = window.document
  const mountPoint = document.createElement('div')

  // Setup global context
  const globalContext = { window, document, fetch: globalThis.fetch }
  Object.assign(global, globalContext)
  document.body.appendChild(mountPoint)

  try {
    // Load and parse component
    const dhtmlPath = path.resolve(__dirname, testName, 'component.dhtml')
    const source = fs.readFileSync(dhtmlPath, 'utf-8')
    const components = parseComponents(source)

    const App = components.find(comp => comp.name === componentName)
    if (!App) {
      throw new Error(`Component "${componentName}" not found in ${testName}/component.dhtml`)
    }

    // Mount component
    const { default: createApp } = await import('../src/browser/nue.js')
    const deps = components.filter(comp => comp !== App)
    const app = createApp(App, data, deps)
    app.mount(mountPoint)

    return {
      app,
      cleanup: () => {
        // Clean up globals
        Object.keys(globalContext).forEach(key => delete global[key])
        mountPoint.remove()
      },
    }
  } catch (error) {
    // Clean up on error
    Object.keys(globalContext).forEach(key => delete global[key])
    throw error
  }
}

/**
 * Parses component source and returns an array of component objects
 * @param {string} source - The component source code
 * @returns {Array<Object>} Array of parsed component objects
 * @throws {Error} If parsing fails
 */
function parseComponents(source) {
  try {
    const { components } = parse(source)
    return components.map(compStr => {
      try {
        return eval(`(${compStr})`)
      } catch (error) {
        throw new Error(`Failed to parse component: ${error.message}`)
      }
    })
  } catch (error) {
    throw new Error(`Failed to parse source: ${error.message}`)
  }
}
