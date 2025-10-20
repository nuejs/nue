
import { createTree, parseHost, getSitenames, parseSitename, getChain } from '../src/tree'

test('createTree', async () => {
  const tree = createTree()

  await tree.load([ 'acme/index.md' ])
  tree.update('acme/index.css')

  expect(tree.getAll().length).toBe(2)
  expect(tree.get('acme/index.css')).toMatchObject({ site: 'acme', path: 'index.css' })

  const page = await tree.find({ host: 'acme.localhost', pathname: '/' })

  expect(page).toMatchObject({ site: 'acme', path: 'index.md' })
})


test('single-site mode', async () => {
  const tree = createTree()
  await tree.load([ 'index.md' ])
  const page = await tree.find({ host: 'localhost', pathname: '/' })
  expect(page.is_base).toBeTrue()
})

test('getSitenames', () => {
  const paths = [
    '@base/site.yaml',
    'clients/acme/site.yaml',
    'clients/beta/site.yaml',
    'projects/blog/site.yaml',
    'projects/blog/index.html',
    'projects/apps/chat/site.yaml',
  ]

  expect(getSitenames(paths)).toEqual(["@base", "acme", "beta", "blog", "chat"])

})

test('parseSitename', () => {
  expect(parseSitename('clients/acme/index.md', ['acme'])).toBe('acme')
  expect(parseSitename('acme/index.md', ['acme'])).toBe('acme')
})

test('parseHost', () => {
  expect(parseHost('acme.production.localhost')).toEqual({ site: 'acme', is_prod: true })

})

test('getChain', async () => {
  const assets = [
    { site: 'acme', path: 'site.yaml', parse: () => ({ extend: ['@base'] }) },
  ]

  const chain = await getChain('acme', assets)
  expect(chain).toEqual(['@base', 'acme'])
})
