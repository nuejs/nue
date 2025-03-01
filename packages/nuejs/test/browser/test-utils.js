import { Window } from 'happy-dom'

/**
 * Creates a browser environment with Nue.js loaded
 * @returns {Object} The browser environment with window and document
 */
export function createBrowserEnv() {
  const window = new Window()
  const document = window.document

  // Make fetch available in the window
  window.fetch = globalThis.fetch

  return { window, document }
}

/**
 * Creates a component from a template string
 * @param {string} template - The component template
 * @param {string} name - The component name
 * @param {Object} scriptContent - The script content (methods, properties)
 * @returns {Object} The compiled component
 */
export function createComponent(template, name = 'test-component', scriptContent = {}) {
  // Create a simple component object that matches the structure expected by createApp
  const component = {
    name,
    tagName: name,
    tmpl: template,
    fns: [],
    dom: null,
  }

  // Add implementation class if script content is provided
  if (Object.keys(scriptContent).length > 0) {
    component.Impl = class {
      constructor() {
        // Add properties
        Object.entries(scriptContent)
          .filter(([key, value]) => typeof value !== 'function')
          .forEach(([key, value]) => {
            this[key] = value
          })
      }
    }

    // Add methods
    Object.entries(scriptContent)
      .filter(([key, value]) => typeof value === 'function')
      .forEach(([key, value]) => {
        component.Impl.prototype[key] = value
      })
  }

  return component
}

/**
 * Loads the Nue.js createApp function
 * @returns {Function} The createApp function
 */
export async function loadNueJs() {
  // Import the module directly using Bun's ESM support
  const nueModule = await import('../../src/browser/nue.js')
  return nueModule.default || nueModule
}

/**
 * Mounts a component to the document
 * @param {Window} window - The happy-dom window
 * @param {Document} document - The happy-dom document
 * @param {Object} component - The component to mount
 * @param {Object} data - The component data
 * @param {Array} deps - Optional array of dependent components
 * @returns {Object} The mounted component instance
 */
export async function mountComponent(window, document, component, data = {}, deps = []) {
  // Create a mount point
  const mountPoint = document.createElement('div')
  document.body.appendChild(mountPoint)

  // Load Nue.js
  const createApp = await loadNueJs()

  // Make browser globals available
  global.window = window
  global.document = document

  // Mount the component
  const app = createApp(component, data, deps)
  app.mount(mountPoint)

  // Return cleanup function along with app
  return {
    app,
    cleanup: () => {
      delete global.window
      delete global.document
    },
  }
}
