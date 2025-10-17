
import { getSitenames, parseSitename } from '../src/serve'

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


