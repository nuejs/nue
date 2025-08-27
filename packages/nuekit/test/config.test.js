
import { createAsset, mergeAppConfig } from '../src/asset'
import { getFileInfo } from '../src/file'


test('site-only settings ignored', () => {
  const conf = { port: 4000, site: { sitemap: true } }
  mergeAppConfig(conf, 'port', 8080)
  mergeAppConfig(conf, 'site', { other: true })
  expect(conf.port).toBe(4000)
  expect(conf.site.sitemap).toBe(true)
})

test('collections extend', () => {
  const conf = { collections: { blog: { sort: 'date' } } }
  mergeAppConfig(conf, 'collections', { team: { sort: 'name' } })
  expect(conf.collections.blog.sort).toBe('date')
  expect(conf.collections.team.sort).toBe('name')
})

test('meta/content merge', () => {
  const conf = { meta: { title: 'Site', author: 'John' } }
  mergeAppConfig(conf, 'meta', { title: 'App' })
  expect(conf.meta.title).toBe('App')
  expect(conf.meta.author).toBe('John')
})

test('simple override', () => {
  const conf = { exclude: ['old'] }
  mergeAppConfig(conf, 'exclude', ['new'])
  expect(conf.exclude).toEqual(['new'])
})


test('data', async () => {

  const files = [
    { path: 'site.yaml', text: 'port: 5000\nsitename: Acme\nproduction:\n  origin:  acme.org' },
    { path: 'team.yaml', text: 'team: [ jane, john ]' },
    { path: 'blog/app.yaml', text: 'port: 3000\ninclude: [ syntax ]\nmeta:\n title: Acme' },
    { path: 'blog/entry/data.yaml', text: 'size: 1000' },
    { path: 'docs/app.yaml', text: 'navi: [foo, bar]' },

  ].map(file => {
    const { text } = file
    return { ...getFileInfo(file.path), text: async function() { return text } }
  })

  const asset = createAsset({ path: 'blog/entry/index.md' }, files, true)


  expect(await asset.data()).toEqual({
    team: [ "jane", "john" ],
    origin: 'acme.org',
    sitename: "Acme",
    is_prod: true,
    title: "Acme",
    size: 1000,
  })

  expect(await asset.config()).toEqual({
    include: [ "syntax" ],
    is_prod: true,
    port: 5000,
  })

})

