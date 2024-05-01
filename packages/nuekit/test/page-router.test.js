import { beforeAll, afterEach, afterAll, test, expect, spyOn, jest } from 'bun:test'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'

import { createKit } from '../src/nuekit.js'

// temporary directory
const dist = path.join(__dirname, './page-router-test/.dist')
const distDev = `${dist}/dev`

// setup and teardown
beforeAll(async () => {
  await fs.rm(dist, { recursive: true, force: true })

  const nue = await createKit({ root: './packages/nuekit/test/page-router-test' })
  await nue.build()
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(async () => {
  await fs.rm(dist, { recursive: true, force: true })
})

function readFile(filePath) {
  return fs.readFile(`${distDev}/${filePath}`)
}

function preparePage(html) {
  const fragment = document.createElement('template')
  fragment.innerHTML = html

  const components = fragment.content.querySelector('[name="nue:components"]')
  // We need to adjust paths for component files to import correctly later.
  components.content = components.content
    .split(' ')
    .map(compPath => `${distDev}${compPath}`)
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

  const html = (await readFile('./index.html')).toString()
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
  await Promise.all([import(`${distDev}/@nue/mount.js`), import(`${distDev}/@nue/page-router.js`)])

  // imitating loaded page
  window.dispatchEvent(new Event('DOMContentLoaded'))

  const logSpy = spyOn(console, 'log')

  await waitFor(() => {
    expect(document.body.querySelector('[is="app"]').innerHTML.trim()).toBe('<h2>App mounted</h2>')
  })

  expect(document.title).toBe('Page Router Test')

  expect(logSpy).toHaveBeenCalledTimes(1)
  expect(logSpy.mock.calls[0][0]).toBe('<app> mounted')
})

test('renders "/page" route and mount component when click in a link', async () => {
  await loadPage()

  // importing scripts manually for side effects
  await Promise.all([import(`${distDev}/@nue/mount.js`), import(`${distDev}/@nue/page-router.js`)])

  // imitating loaded page
  window.dispatchEvent(new Event('DOMContentLoaded'))

  const logSpy = spyOn(console, 'log')
  // mocking window.fetch API
  spyOn(window, 'fetch').mockImplementation(async () => {
    const pageHtml = (await readFile('./page/index.html')).toString()
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
