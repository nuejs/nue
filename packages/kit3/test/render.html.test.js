
import { renderHTML } from '../src/render/html'
import { parseNue } from 'nuedom'

test('standalone HTML', async () => {
  const asset = {
    parse() {
      return parseNue('<!doctype html> <html></html>')
    },

    text() { return '<html/>' }
  }

  const html = await renderHTML(asset)
  expect(html).toBe('<html/>')
})

test('HTML page', async () => {
  const asset = {
    parse() {
      return parseNue('<!doctype html> <h1>Hello</h1> <p>World</p>')
    }
  }
  const html = await renderHTML(asset, [], [])
  expect(html).toInclude('<article><h1>Hello</h1> <p>World</p></article>')
})


test('SPA', async () => {
  const asset = {
    async parse() {
      return parseNue('<!doctype dhtml> <body><h1>Hello</h1></body>')
    },
  }

  const html = await renderHTML(asset, [], [])
  expect(html).toInclude('<body nue="default-app"></body>')
  expect(html).toInclude('{"state":"/@nue/state.js"}')
})

