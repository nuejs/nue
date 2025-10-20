
import { getPathInfo, createAsset, getURL, getSlug } from '../src/asset'
import { parse } from 'node:path'

test('acme blog asset', () => {
  const info = getPathInfo('projects/acme/blog/index.md', 'acme')

  expect(info).toMatchObject({
    is_md: true,
    site: "acme",
    folder: "projects",
    path: "blog/index.md",
    type: "md",
    app: "blog",
  })
})

test('@base asset', () => {
  const info = getPathInfo('@base/blog/index.md', '@base')
  // console.info(asset)

  expect(info).toMatchObject({
    path: 'blog/index.md',
    dir: 'blog',
    app: 'blog',
    ext: '.md',
    type: 'md',
    is_md: true,
    is_base: true,
    folder: null,
  })
})

test('@base info', () => {
  const info = getPathInfo('@base/index.html', '@base')
  expect(info).toMatchObject({ is_html: true, app: null, folder: null, dir: '' })
})

test('getPathInfo', () => {
  const info = getPathInfo('blog/index.md')
  expect(info).toMatchObject({ site: null, folder: null, path: "blog/index.md" })
})


test('createAsset', async () => {
  const mockPath = './test-file.md'
  const file = Bun.file(mockPath)
  await Bun.write(mockPath, '# Hello')

  const asset = createAsset(mockPath, '.')

  expect(asset.file.type).toBe('text/markdown')
  expect(await asset.text()).toBe('# Hello')

  const { meta } = await asset.parse()
  expect(meta.title).toBe('Hello')

  await file.delete()
})

test('url property', () => {
  function testURL(path, expected) {
    expect(getURL(parse(path))).toBe(expected)
  }
  testURL('index.md', '/')
  testURL('index.css', '/index.css')
  testURL('blog/entry.md', '/blog/entry')
  testURL('app/index.html', '/app/')
  testURL('blog/table.html', '/blog/table')
  testURL('docs/installation.md', '/docs/installation')
  testURL('@shared/design/base.css', '/@shared/design/base.css')
  testURL('site.yaml', '/site.yaml')
})

test('slug property', () => {
  expect(getSlug(parse('blog/entry.md'))).toBe('entry')
  expect(getSlug(parse('blog/index.html'))).toBe('')
})


