
import { getCollections } from '../src/collections.js'
import { createAsset } from '../src/asset'

// Mock page objects
const pages = [
  {
    is_md: true,
    path: 'blog/post1.md',
    parse: async () => ({ meta: { title: 'First Post', date: '2024-01-01', draft: false } })
  },
  {
    is_md: true,
    path: 'blog/post2.md',
    parse: async () => ({ meta: { title: 'Second Post', date: '2024-01-02' } })
  },
  {
    is_md: true,
    path: 'blog/draft.md',
    parse: async () => ({ meta: { title: 'Draft Post', draft: true } })
  },
  {
    is_md: true,
    path: 'docs/guide.md',
    parse: async () => ({ meta: { title: 'Guide', order: 1 } })
  }
]

test('basic collection matching', async () => {
  const opts = { blog: { include: ['blog/'] } }

  const collections = await getCollections(pages, opts)
  expect(collections.blog).toHaveLength(3)
})

test('require filtering', async () => {
  const opts = {
    blog: {
      include: ['blog/'],
      require: ['date']
    }
  }

  const collections = await getCollections(pages, opts)
  expect(collections.blog).toHaveLength(2)
})

test('skip filtering', async () => {
  const opts = {
    blog: {
      include: ['blog/'],
      skip: ['draft']
    }
  }

  const collections = await getCollections(pages, opts)
  expect(collections.blog).toHaveLength(2)
})

test('sorting', async () => {
  const opts = {
    blog: {
      include: ['blog/'],
      skip: ['draft'],
      sort: 'date desc'
    }
  }

  const collections = await getCollections(pages, opts)
  expect(collections.blog[0].title).toBe('Second Post')
})


test('rendering', async () => {
  const pagefoot = '<!html lib><div :is="pagefoot"><p :each="page of pages">{ page.title }</div>'
  const conf = 'collections:\n  pages:\n    include: [ blog/ ]'

  const files = [
    { is_md: true, path: 'blog/index.md', async text() { return '# Hello' } },
    { is_yaml: true, path: 'blog/app.yaml', async text() { return conf }},
    { is_html: true, path: '@system/layout/pagefoot.html', async text() { return pagefoot } },
  ]

  const page = createAsset(files[0], files)
  const html = await page.render()
  expect(html).toInclude('<div><p>Hello</p></div>')

})

