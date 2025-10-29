
import { createTree, parseHost, getSitenames, parseSitename, getChain } from '../src/tree'


test('createTree', async () => {
  const tree = createTree()

  await tree.load([ 'acme/index.md' ])
  tree.update('acme/index.css')

  expect(tree.getAll().length).toBe(2)
  expect(tree.get('acme/index.css')).toMatchObject({ site: 'acme', path: 'index.css' })
})

test.only('getSitenames', () => {
  const paths = [
    '@base/site.yaml',
    'acme/blog/index.md',
    'acme/site.yaml',
    'sites/beta/app/index.html',
    'sites/beta/index.md'
  ]

  const names = getSitenames(paths)
  console.info(names)
  // expect(names).toEqual(["@base", "beta"])
})

test('parseSitename', () => {
  expect(parseSitename('clients/acme/index.md', ['acme'])).toBe('acme')
  expect(parseSitename('acme/index.md', ['acme'])).toBe('acme')
})

test('getChain', async () => {
  const assets = [
    { site: 'acme', path: 'site.yaml', parse: () => ({ extend: ['@base'] }) },
  ]

  const chain = await getChain('acme', assets)
  expect(chain).toEqual(['@base', 'acme'])
})

test('parseHost', () => {
  expect(parseHost('acme.production.localhost')).toEqual({ site: 'acme', is_prod: true })
})

test('single-mode chain', async () => {
  expect(await getChain(null, [])).toEqual([ null ])
})
