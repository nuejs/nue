

import { parseMarkdown, getParts } from '../src/util.js'
import { match } from '../src/browser/app-router.js'
import { renderHead } from '../src/layout.js'
import { getArgs } from '../src/cli.js'



test('CLI args', () => {
  const args = getArgs(['nue', 'build', '--verbose', '-pnve', 'joku.yaml'])
  expect(args.env).toBe('joku.yaml')
  expect(args.dryrun).toBe(true)
  expect(args.verbose).toBe(true)
})

test('head', () => {
  const head = renderHead({ charset: 'foo', title: 'Hey', preload_image: 'hey.png' })
  expect(head).toInclude('meta charset="foo"')
  expect(head).toInclude('<title>Hey</title>')
  expect(head).toInclude('<link rel="preload" as="image" href="hey.png">')
})


test('markdown', async () => {
  const { meta, content } = parseMarkdown('---\nog: og.png\n---\n# Hey')
  expect(meta.og).toBe('og.png')
  expect(content.trim()).toBe('<h1>Hey</h1>')
})

test('app router', async () => {
  expect(match('/fail/:id', '/users/20')).toBeNull()
  expect(match('/users/:id/edit', '/users/20')).toBeNull()
  expect(match('/users/:id', '/users/20')).toEqual({ id: 20 })
  expect(match('/:view/:id', '/users/20')).toEqual({ id: 20, view: 'users' })
})

test('path parts', () => {
  const parts = getParts('docs/glossary/semantic-css.md')
  expect(parts.url).toBe('/docs/glossary/semantic-css.html')
  expect(parts.dir).toBe('docs/glossary')
  expect(parts.appdir).toBe('docs')
  expect(parts.slug).toBe('semantic-css.html')
})

