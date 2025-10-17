
import { findAsset, getChain } from '../src/find'

test('findAsset', async () => {
  const assets = new Map([
    ['@base/blog/index.md', { is_base: true, path: 'blog/index.md'}],
    ['@base/404.md', { is_base: true, path: '404.md'}],

    ['acme/site.yaml', { parse: () => ({ }) }],
    ['acme/blog/index.md', { site: 'acme', parse: () => ({ }) }],

    ['beta/site.yaml', {}],
    ['acme/ui/form.html', { is_html: true }],
  ])


  expect(await findAsset('/blog/', 'acme', assets)).toMatchObject({ site: 'acme' })

  expect(await findAsset('/ui/form.html.js', 'acme', assets)).toMatchObject({ is_html: true })
  // expect().toMatchObject({ is_html: true })

  expect(await findAsset('/notexist', 'acme', assets)).toMatchObject({ is_base: true, path: '404.md' })
  expect(await findAsset('notexist.css', 'acme', assets)).toBeNull()
})

test('@nue assets', async () => {

})


test('getChain', async () => {
  const assets = new Map([
    ['acme/site.yaml', { parse: () => ({ inherits: 'mies' }) }],
    ['mies/site.yaml', { parse: () => ({ inherits: 'minimal' }) }],
    ['minimal/site.yaml', { parse: () => ({}) }]
  ])

  const chain = await getChain('acme', assets)
  expect(chain).toEqual(['acme', 'mies', 'minimal', '@base'])
})