import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createWindow } from 'domino'

import { parse } from '../src/compile.js'


/**
 * Get directory from url
 * @param {Url} url - Pass `import.meta.url`
 * @returns {string} Directory path containing the current file
 */
export function getDirname(url) {
  return dirname(fileURLToPath(url))
}

/**
 * Get directory path from url and return function for usage with {@linkcode mountTestComponent}
 * @param {Url} url - `import.meta.url` to get the test directory
 */
export function mkConfigBase(url) {
  /**
   * @param {string} componentName
   * @param {Object?} data
   */
  return (componentName, data) => ({ testPath: getDirname(url), componentName, data })
}


/**
 * Mounts a component from a test directory
 * @param {Object} options - Mount options
 * @param {string} options.testPath - The path to the test directory
 * @param {string} options.componentName - Name of the specific component to mount
 * @param {Object} [options.data={}] - Data to initialize the component with
 */
export async function mountTestComponent({ testPath, componentName, data = {} }) {
  // Validate inputs
  if (!testPath || !componentName) throw new Error('Required parameters missing: "testPath" and "componentName" must be provided')

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
    const dhtmlPath = join(testPath, 'component.dhtml')
    const source = readFileSync(dhtmlPath, 'utf-8')
    const components = parseComponents(source)

    const App = components.find(comp => comp.name === componentName)
    if (!App) throw new Error(`Component "${componentName}" not found in "${dhtmlPath}"`)

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
