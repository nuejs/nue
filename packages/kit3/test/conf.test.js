
import { getConf, getData } from '../src/conf'
import { getPathInfo } from '../src/asset'

function mockYaml(site, path, data) {
  return { ...getPathInfo(path, site), async parse() { return data }}
}

test('getConf', async () => {
  const assets = [
    mockYaml('@base', 'site.yaml', { site: { origin: 'acme.org' }}),
    mockYaml('acme', 'site.yaml', { rss: { enabled: true }, color: 'blue' }),
    mockYaml('acme', 'blog/app.yaml', { content: { heading_ids: true } }),
  ]

  const conf = await getConf('blog', ['acme', '@base'], assets, true)

  expect(conf).toEqual({
    rss: { enabled: true },
    site: { origin: "acme.org" },
    content: { heading_ids: true },
    is_prod: true
  })
})


test('getData', async () => {
  const deps = [
    { is_yaml: true, parse() { return { title: 'My Site', authors: ['John', 'Jane'] }}},
    { is_yaml: true, parse() { return { products: ['A', 'B'] }}},
  ]

  const data = await getData(deps, false)
  expect(data.authors).toEqual(['John', 'Jane'])
  expect(data.products).toEqual(['A', 'B'])
})


test('merge meta', async () => {
  const deps = [
    { is_yaml: true, parse() { return { meta: { title: 'Hey' } }}},
    { is_yaml: true, parse() { return { meta: { lang: 'fi' } }}},
  ]
  const data = await getData(deps, true)
  expect(data).toEqual({ title: "Hey", lang: "fi", is_prod: true })
})

test('production data', async () => {
  const deps = [
    { is_yaml: true, parse() { return { meta:{ url: 'bad' } }}},
    { is_yaml: true, parse() { return { production: { url: 'example.com' } }}},
  ]

  const data = await getData(deps, true)
  expect(data.url).toBe('example.com')
})

