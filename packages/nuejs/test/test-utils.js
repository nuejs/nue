import { createWindow } from 'domino'
import { parse } from '../src/compile.js'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Mounts a component from a test directory
//  * @param {string} testName - The name of the test directory
//  * @param {string} componentName - Optional name of the specific component to mount (defaults to first component)
//  * @param {Object} data - Optional data for the component
 * @returns {Object} The mounted component instance and cleanup function
 */
export async function mountTestComponent({ testName, componentName, data = {} }) {
  if (!testName || !componentName) throw new Error('Missing testName or componentName')

  // Load the component source from the component.dhtml file in the test directory
  const dhtmlPath = path.resolve(__dirname, testName, 'component.dhtml')
  const source = fs.readFileSync(dhtmlPath, 'utf-8')

  // Setup domino environment
  const window = createWindow('<!DOCTYPE html><html><body></body></html>')
  const document = window.document

  // Make browser globals available
  global.window = window
  global.document = document
  window.fetch = globalThis.fetch

  // Create a mount point
  const mountPoint = document.createElement('div')
  document.body.appendChild(mountPoint)

  // Parse the component source
  const components = parseComponents(source)

  // Find the component with the matching name attribute
  const App = components.find(comp => comp.name === componentName)
  if (!App) {
    throw new Error(`Component "${componentName}" not found in ${testName}/component.dhtml`)
  }

  // All other components become dependencies
  const deps = components.filter(comp => comp !== App)

  // Mount the component
  const { default: createApp } = await import('../src/browser/nue.js')
  const app = createApp(App, data, deps)
  app.mount(mountPoint)

  return {
    app,
    cleanup: () => {
      delete global.window
      delete global.document
    },
  }
}

/**
 * Parses component source and returns an array of component objects
 * @param {string} source - The component source code
 * @returns {Array} Array of parsed component objects
 */
function parseComponents(source) {
  try {
    const { components } = parse(source)

    return components.map(compStr => {
      try {
        return eval(`(${compStr})`)
      } catch (e) {
        console.error('Error parsing component:', e.message)
        throw e
      }
    })
  } catch (e) {
    console.error('Error parsing source:', e.message)
    throw e
  }
}
