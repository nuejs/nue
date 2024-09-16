import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

import { createKit } from '../src/nuekit.js'

const dir = fileURLToPath(dirname(import.meta.url))
const reldir = relative(process.cwd(), dir)

// temporary directory
const root = join(reldir, 'page-router-test')
const dist = join(dir, 'page-router-test/.dist')
const out = join(dist, 'dev')


// setup and teardown
beforeAll(async () => {
  GlobalRegistrator.register()
  await fs.rm(dist, { recursive: true, force: true })

  const nue = await createKit({ root })
  await nue.build()
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(async () => {
  await fs.rm(dist, { recursive: true, force: true })
  await GlobalRegistrator.unregister()
})

async function read(filePath) {
  return await fs.readFile(join(out, filePath), 'utf-8')
}

function preparePage(html) {
  const fragment = document.createElement('template')
  fragment.innerHTML = html

  const components = fragment.content.querySelector('[name="nue:components"]')
  // We need to adjust paths for component files to import correctly later.
  components.content = components.content
    .split(' ')
    .map(compPath => `${out}${compPath}`)
    .join(' ')

  /**
   * @happy-dom do not support loading scripts from local files without server yet:
   * https://github.com/capricorn86/happy-dom/issues/318
   * https://github.com/capricorn86/happy-dom/issues/320
   * https://github.com/capricorn86/happy-dom/issues/600
   */
  fragment.content.querySelectorAll('script').forEach(script => script.remove())

  return fragment
}

async function loadPage() {
  window.happyDOM.setURL('http://localhost:8080')

  const html = await read('index.html')
  const fragment = preparePage(html)

  document.replaceChildren(fragment.content.cloneNode(true))
}

async function waitFor(callback) {
  await window.happyDOM.waitUntilComplete()

  return new Promise(resolve => {
    function runCallback() {
      try {
        callback()

        // cleanup
        clearInterval(callbackIntervalId)
        observer.disconnect()

        resolve()
      } catch (error) {
        // If `callback` throws, wait for the next mutation, interval or timeout.
      }
    }

    const callbackIntervalId = setInterval(runCallback, 50)

    const observer = new MutationObserver(runCallback)
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      childList: true,
    })

    runCallback()
  })
}

test('renders "/" route and mount component', async () => {
  await loadPage()

  // importing scripts manually for side effects
  await Promise.all([import(join(out, '@nue/mount.js')), import(join(out, '@nue/view-transitions.js'))])

  // imitating loaded page
  window.dispatchEvent(new Event('DOMContentLoaded'))

  const logSpy = jest.spyOn(console, 'log')

  await waitFor(() => {
    expect(document.body.querySelector('[is="app"]').innerHTML.trim()).toBe('<h2>App mounted</h2>')
  })

  expect(document.title).toBe('Page Router Test - Home')

  expect(logSpy).toHaveBeenCalledTimes(1)
  expect(logSpy.mock.calls[0][0]).toBe('<app> mounted')
})

test('renders "/page" route and mount component when click in a link', async () => {
  await loadPage()

  // importing scripts manually for side effects
  await Promise.all([import(join(out, '@nue/mount.js')), import(join(out, '@nue/view-transitions.js'))])

  // imitating loaded page
  window.dispatchEvent(new Event('DOMContentLoaded'))

  const logSpy = jest.spyOn(console, 'log')
  // mocking window.fetch API
  jest.spyOn(window, 'fetch').mockImplementation(async () => {
    const pageHtml = await read('page/index.html')
    const pageFragment = preparePage(pageHtml)

    return Promise.resolve({
      text: () => {
        const serializer = new XMLSerializer()
        return serializer.serializeToString(pageFragment.content)
      },
    })
  })

  /**
   * The "click()" method does not work - looks like generated event is buggy.
   * document.body.querySelector('a[href="/page"]').click()
   */
  document.body.querySelector('a[href="/page"]').dispatchEvent(
    new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  )

  await waitFor(() => {
    expect(document.body.querySelector('[is="component"]').innerHTML.trim()).toBe(
      '<h2>Page component mounted</h2>'
    )
  })

  /**
   * It does not work for now:
   * expect(location.pathname).toBe('/page')
   * https://github.com/capricorn86/happy-dom/issues/994
   */
  expect(document.title).toBe('Page Router Test - Page')

  expect(logSpy).toHaveBeenCalledTimes(2)
  expect(logSpy.mock.calls[0][0]).toBe('<app> mounted')
  expect(logSpy.mock.calls[1][0]).toBe('<component> mounted')
})
