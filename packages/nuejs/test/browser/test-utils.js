import { createWindow } from 'domino'
import { parse } from '../../src/compile.js'

/**
 * Mounts a component directly from source string
 * @param {string} source - The component source string
 * @param {Object} data - Optional data for the component
 * @returns {Object} The mounted component instance and cleanup function
 */
export async function mountTestComponent(source, data = {}) {
  // Setup domino environment
  const window = createWindow('<!DOCTYPE html><html><body></body></html>')
  const document = window.document

  // Make browser globals available
  global.window = window
  global.document = document

  // Create a mount point
  const mountPoint = document.createElement('div')
  document.body.appendChild(mountPoint)

  // Parse the component source
  const components = parseComponents(source)
  const [App, ...deps] = components

  // Mount the component
  const { default: createApp } = await import('../../src/browser/nue.js')
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
