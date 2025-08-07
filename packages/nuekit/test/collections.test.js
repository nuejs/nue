
import { getCollections } from '../src/collections.js'
import { createAsset } from '../src/asset'

// Mock page objects
const pages = [
  {
    path: 'blog/post1.md',
    document: async () => ({ meta: { title: 'First Post', date: '2024-01-01', draft: false } })
  },
  {
    path: 'blog/post2.md',
    document: async () => ({ meta: { title: 'Second Post', date: '2024-01-02' } })
  },
  {
    path: 'blog/draft.md',
    document: async () => ({ meta: { title: 'Draft Post', draft: true } })
  },
  {
    path: 'docs/guide.md',
    document: async () => ({ meta: { title: 'Guide', order: 1 } })
  }
]

test('basic collection matching', async () => {
  const opts = { blog: { match: ['blog/*.md'] } }

  const collections = await getCollections(pages, opts)
  expect(collections.blog).toHaveLength(3)
})

test('require filtering', async () => {
  const opts = {
    blog: {
      match: ['blog/*.md'],
      require: ['date']
    }
  }

  const collections = await getCollections(pages, opts)
  expect(collections.blog).toHaveLength(2)
})

test('skip filtering', async () => {
  const opts = {
    blog: {
      match: ['blog/*.md'],
      skip: ['draft']
    }
  }

  const collections = await getCollections(pages, opts)
  expect(collections.blog).toHaveLength(2)
})

test('sorting', async () => {
  const opts = {
    blog: {
      match: ['blog/*.md'],
      skip: ['draft'],
      sort: 'date desc'
    }
  }

  const collections = await getCollections(pages, opts)
  expect(collections.blog[0].title).toBe('Second Post')
})


test('rendering', async () => {
  const tmpl = '<pagefoot><p :each="page of pages">${ page.title }</p></pagefoot>'
  const conf = 'collections:\n  pages:\n    match: [ **/*.md ]'

  const files = [
    { is_md: true, path: 'blog/index.md', async text() { return '# Hello' } },
    { is_yaml: true, path: 'blog/app.yaml', async text() { return conf }},
    { is_html: true, path: '@system/layout/pagefoot.html', async text() { return tmpl } },
  ]

  const page = createAsset(files[0], files)
  const html = await page.render()
  expect(html).toInclude('<div><p>Hello</p></div>')

})

