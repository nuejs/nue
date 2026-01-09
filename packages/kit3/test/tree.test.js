
import { createTree, parseHost, getSitenames, parseSitename, getChain } from '../src/tree'


test('add asset', async () => {
  const tree = createTree()

  await tree.load([ 'acme/index.md' ])
  tree.update('acme/index.css')

  expect(tree.getAll().length).toBe(2)
  expect(tree.get('acme/index.css')).toMatchObject({ site: 'acme', path: 'index.css' })
})

test('add site', async () => {
  const tree = createTree()

  await tree.load([])
  tree.update('acme/site.yaml')
  tree.update('beta/site.yaml')
  tree.update('beta/docs/index.md')
  const arr = tree.getAll().map(el => el.site)
  expect(arr).toEqual([ 'acme', 'beta', 'beta' ])
})


test('getSitenames', () => {
  const paths = [
    '@base/site.yaml',
    'acme/blog/index.md',
    'acme/site.yaml',
    'sites/beta/app/index.html',
    'sites/beta/index.md',
    'dev.io/site.yaml'
  ]

  const names = getSitenames(paths)
  expect(names).toEqual(['@base', 'acme', 'beta', 'dev.io'])
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
  expect(parseHost('localhost')).toEqual(null)
  expect(parseHost('acme.localhost')).toEqual('acme')
  expect(parseHost('dev.io.localhost')).toBe('dev.io')
})

test('single-mode chain', async () => {
  expect(await getChain(null, [])).toEqual([ null, '@base' ])
})
