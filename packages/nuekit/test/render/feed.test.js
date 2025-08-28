
import { generateSitemap, generateFeed, renderSitemap, renderFeed } from '../../src/render/feed'


test('generateSitemap', async () => {
  const asset = {
    is_md: true,
    url: '/page1',
    mtime: new Date('2024-01-01'),
    parse: async () => ({ meta: { title: 'Page 1' } })
  }

  const draft = {
    is_md: true,
    parse: async () => ({ meta: { draft: true } })
  }

  const conf = {
    site: { origin: 'https://example.com' },
    sitemap: { skip: ['draft'] }
  }

  const xml = await generateSitemap([asset, draft ], conf)
  expect(xml.length < 200).toBeTrue()
  expect(xml).toInclude('<loc>https://example.com/page1</loc>')
})

test('generateFeed', async () => {

  const meta = {
    date: new Date('2026-01-01'),
    title: 'First',
    desc: 'Desc',
  }

  const asset = {
    is_md: true,
    path: 'blog/first.md',
    url: '/blog/first',
    parse: async () => ({ meta })
  }

  const conf = {
    site: { origin: 'https://acme.org' },
    rss: {
      title: 'Acme Blog',
      collection: 'blog',
      description: 'Acme desc'
    },
    collections: {
      blog: {
        include: ['blog/']
      }
    }
  }

  const xml = await generateFeed([asset], conf)

  expect(xml.length).toBeGreaterThan(300)
  expect(xml).toInclude('<title>Acme Blog</title>')
  expect(xml).toInclude('<link>https://acme.org/blog/first</link>')
  expect(xml).toInclude('<pubDate>2026-01-01</pubDate>')
})

test('renderSitemap', () => {
  const page = { mtime: new Date(), url: '/about', origin: 'https://acme.org' }
  const xml = renderSitemap([page])
  expect(xml).toInclude('<loc>https://acme.org/about</loc>')
})

test('renderFeed', () => {
  const meta = {
    title: 'My Blog',
    description: 'A test blog',
    origin: 'https://example.com'
  }

  const page = {
    title: 'First Post',
    description: 'My first blog post',
    pubDate: new Date('2025-01-15'),
    url: '/first-post',
  }

  const xml = renderFeed(meta, [page])

  expect(xml).toInclude('<rss version="2.0">')
  expect(xml).toInclude('<title>My Blog</title>')
  expect(xml).toInclude('<title>First Post</title>')
  expect(xml).toInclude('<pubDate>2025-01-15</pubDate>')
  expect(xml).toInclude('https://example.com/first-post')
})