
import { renderSlots, renderPage, renderMD, renderHTML, renderDHTML } from '../../src/render/page'


test('renderSlots', () => {
  const comps = [{ tag: 'header' }]
  const content = '<h1>Hey</h1>'
  let html = renderSlots({ content, comps })
  expect(html).toInclude('<header></header>')
  expect(html).toInclude(content)
  expect(html).toInclude('<main>')

  // scoping & slot disable
  html = renderSlots({ content, comps, data: { scope: 'main', header: false } })
  expect(html).not.toInclude('<main>')
  expect(html).not.toInclude('<header>')
  expect(html).toInclude(content)

})


test('renderPage', async () => {
  const content = '<h1>Hey</h1>'

  const asset = {
    url: '/blog/',
    async assets() { return [] },
    async parse() { return {} },
  }

  const html = await renderPage({ asset, content })
  expect(html).toInclude('/@nue/hmr.js')
})



test('renderMD', async () => {
  const content = '<h1>Hello</h1>'

  const asset = {
    async data() {
      return { language: 'fi', scope: 'body' }
    },
    async parse() {
      return {
        render() { return content }
      }
    },
    async assets() {
      return [
        { async parse() { return { doctype: 'dhtml lib' } }, path: 'comps.html', is_html: true }
      ]
    },
    async components() {
      return []
    },
  }

  const html = await renderMD(asset)
  expect(html).toInclude('<html lang="fi">')
  expect(html).toInclude('<meta name="libs" content="comps.html">')
  expect(html).toInclude('script src="/@nue/mount.js"')
  expect(html).not.toInclude('<body>')
  expect(html).toInclude(content)
})

test('renderHTML', async () => {
  const asset = {
    async data() {return {} },
    async assets() { return [] },

    async parse() {
      const root = { tag: 'main', children: [{ text: 'Hello' }, { tag: 'world', is_custom: true }]}
      return { root, lib: [root] }
    },
    async components() {
      return [
        { tag: 'world', children: [{ text: 'World' }]}
      ]
    },
  }


  const html = await renderHTML(asset)
  expect(html).toInclude('<main>Hello<div>World</div></main>')
})


test('renderDHTML', async () => {
  const asset = {
    async data() { return {} },
    async assets() { return [] },
    async components() { return [] },

    async parse() {
      const root = { tag: 'main', is: 'app' }
      return { root, lib: [root] }
    },
  }

  const { html, js } = await renderDHTML(asset)
  expect(html).toInclude('<main nue="app"></main>')
  expect(js).toInclude('export const lib = [')
})

