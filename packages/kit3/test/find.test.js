
import { findAsset, getChain } from '../src/find'

test('findAsset', async () => {
  const assets = [
    { site: '@base', path: 'blog/index.md'},
    { site: '@base', path: '404.md'},
    { site: 'acme', path: 'blog/index.md'},
    { site: 'acme', path: 'ui/form.html' },
  ]
  const chain = ['acme', '@base']


  expect(await findAsset('/blog/', chain, assets)).toMatchObject({ site: 'acme', path: 'blog/index.md'})

  expect(await findAsset('/ui/form.html.js', chain, assets)).toMatchObject({ path: 'ui/form.html' })

  expect(await findAsset('/notexist', chain, assets)).toMatchObject({ path: '404.md' })

  expect(await findAsset('notexist.css', chain, assets)).toBeNull()
})


test('getChain', async () => {
  const assets = [
    { site: 'mies', path: 'site.yaml', parse: () => ({ inherits: 'minimal' }) },
    { site: 'acme', path: 'site.yaml', parse: () => ({ inherits: 'mies' }) },
    { site: 'minimal', path: 'site.yaml', parse: () => ({}) }
  ]

  const chain = await getChain('acme', assets)
  expect(chain).toEqual(['acme', 'mies', 'minimal', '@base'])
})