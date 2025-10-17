
import { getConf, getData } from '../src/conf'

function mockYaml(data) {
  return { is_yaml: true, async parse() { return data }}
}

test('getConf', async () => {
  const assets = new Map([
    ['@base/site.yaml', mockYaml({ site: { origin: 'acme.org' }})],
    ['acme/site.yaml', mockYaml({ rss: { enabled: true }, color: 'blue' })],
    ['acme/blog/app.yaml', mockYaml({ content: { heading_ids: true } })],
  ])

  const conf = await getConf('blog', ['acme', '@base'], assets)

  expect(conf).toEqual({
    rss: { enabled: true },
    site: { origin: "acme.org" },
    content: { heading_ids: true },
  })
})


test('getData', async () => {
  const deps = [
    mockYaml({ title: 'My Site', authors: ['John', 'Jane'] }),
    mockYaml({ products: ['A', 'B'] })
  ]

  const data = await getData(deps, false)
  expect(data.authors).toEqual(['John', 'Jane'])
  expect(data.products).toEqual(['A', 'B'])
})

test('getData filters conf keys', async () => {
  const deps = [mockYaml({ site: 'ignored', authors: ['John'] })]

  const data = await getData(deps, false)
  expect(data.site).toBeUndefined()
  expect(data.authors).toEqual(['John'])
})

test('merge meta', async () => {
  const deps = [
    mockYaml({ meta: { title: 'Hey' } }),
    mockYaml({ meta: { lang: 'fi' } })
  ]
  const data = await getData(deps, true)
  expect(data).toEqual({ title: "Hey", lang: "fi", is_prod: true })
})

test('production data', async () => {
  const deps = [mockYaml({
    meta: { url: 'localhost' },
    production: { url: 'example.com' }
  })]

  const data = await getData(deps, true)
  expect(data.url).toBe('example.com')
})