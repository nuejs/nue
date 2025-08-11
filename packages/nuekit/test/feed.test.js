import { promises as fs, existsSync } from 'node:fs'
import { join, parse } from 'node:path'

import { createKit } from '../src/nuekit.js'
import { collectionToFeed } from '../src/layout/components.js'


const root = '_test_feed' // temporary directory

beforeEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
  await fs.mkdir(root, { recursive: true })
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
})

// helper function for creating files to the root directory
async function write(path, content = '') {
  const { dir } = parse(path)
  await fs.mkdir(join(root, dir), { recursive: true })
  await fs.writeFile(join(root, path), content)
}

async function readDist(dist, path) {
  return await fs.readFile(join(dist, path), 'utf-8')
}

async function getKit(dryrun = true) {
  if (!existsSync(join(root, 'site.yaml'))) await write('site.yaml', '')
  return await createKit({ root, dryrun })
}

test('generates valid Atom feed for collection with has_feed: true', async () => {

  await write('site.yaml', `
origin: https://example.com
title_template: "Test Site / %s"
nuekit_version: "1.0.0"
`)

  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  await write('blog/post1.md', `---
title: First Post
date: 2024-01-15
description: This is the first post
---

# First Post

Content here.
`)

  await write('blog/post2.md', `---
title: Second Post  
date: 2024-01-20
description: This is the second post
---

# Second Post

More content here.
`)

  const kit = await getKit(false)
  await kit.build()

  const feedExists = existsSync(join(kit.dist, 'blog', 'feed.xml'))
  expect(feedExists).toBe(true)

  const feedContent = await readDist(kit.dist, 'blog/feed.xml')
  
  expect(feedContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(feedContent).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(feedContent).toContain('<title>Test Site / Blog</title>')
  expect(feedContent).toContain('<link href="https://example.com/blog/" rel="alternate"/>')
  expect(feedContent).toContain('<id>https://example.com/blog/feed.xml</id>')
  expect(feedContent).toContain('<generator uri="https://nuejs.org/" version="1.0.0">Nuekit</generator>')
  expect(feedContent).toContain('<link href="https://example.com/blog/feed.xml" rel="self" type="application/atom+xml"/>')
  
  expect(feedContent).toContain('<entry>')
  expect(feedContent).toContain('<title>First Post</title>')
  expect(feedContent).toContain('<title>Second Post</title>')
  expect(feedContent).toContain('https://example.com/blog/post1.html')
  expect(feedContent).toContain('https://example.com/blog/post2.html')
  expect(feedContent).toContain('This is the first post')
  expect(feedContent).toContain('This is the second post')
})


test('does not generate feed when has_feed is false or undefined', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "Test Site / %s"
`)

  await write('blog/blog.yaml', `
content_collection: blog
has_feed: false
`)

  await write('blog/post1.md', `---
title: Test Post
date: 2024-01-15
description: Test description
---

# Test Post
`)

  const kit1 = await getKit(false)
  await kit1.build()

  const feedExists1 = existsSync(join(kit1.dist, 'blog', 'feed.xml'))
  expect(feedExists1).toBe(false)

  // has_feed not specified
  await write('blog2/blog2.yaml', `
content_collection: blog2
`)

  await write('blog2/post1.md', `---
title: Another Test Post
date: 2024-01-15
description: Another test description
---

# Another Test Post
`)

  const kit2 = await getKit(false)
  await kit2.build()

  const feedExists2 = existsSync(join(kit2.dist, 'blog2', 'feed.xml'))
  expect(feedExists2).toBe(false)
})

test('formats feed titles with proper capitalization and arrow notation', async () => {
  const data = {
    origin: 'https://test.com',
    title_template: 'My Site / %s',
    items: [],
  }

  const feed1 = collectionToFeed({ ...data, title: 'blog', })
  expect(feed1).toContain('<title>My Site / Blog</title>')

  const feed2 = collectionToFeed({ ...data, title: 'my-awesome-blog' })
  expect(feed2).toContain('<title>My Site / My Awesome Blog</title>')

  const feed3 = collectionToFeed({ ...data, title: 'blog/child-category' })
  expect(feed3).toContain('<title>My Site / Blog → Child Category</title>')

  const feed4 = collectionToFeed({ ...data, title: 'tech-blog/web-development/frontend-tips' })
  expect(feed4).toContain('<title>My Site / Tech Blog → Web Development → Frontend Tips</title>')

  const feed5 = collectionToFeed({  ...data, title: 'blog/Category+2' })
  expect(feed5).toContain('<title>My Site / Blog → Category 2</title>')

  const feed6 = collectionToFeed({  ...data, title: 'blog_posts' })
  expect(feed6).toContain('<title>My Site / Blog Posts</title>')
})

test('properly integrates with title_template from site.yaml', async () => {
  const templates = [
    'Simple - %s',
    '%s | My Website',
    'Blog: %s',
    '%s'
  ]

  for (const template of templates) {
    const data = {
      origin: 'https://test.com',
      title_template: template,
      nuekit_version: '1.0.0',
      items:  [],
    }

    const feed = collectionToFeed({...data, title: 'tech-blog'})
    const expectedTitle = template.replace('%s', 'Tech Blog')
    expect(feed).toContain(`<title>${expectedTitle}</title>`)
  }

  // title_template missing
  const dataWithoutTemplate = {
    origin: 'https://test.com',
    nuekit_version: '1.0.0',
    items: [],
  }
  
  const feedWithoutTemplate = collectionToFeed({...dataWithoutTemplate, title: 'my-awesome-blog'})
  expect(feedWithoutTemplate).toContain('<title>My Awesome Blog</title>') // no affix
})

test('generates separate feeds for subcategories with has_feed: true', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "My Site / %s"
nuekit_version: "1.0.0"
`)

  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  await write('blog/tech/tech.yaml', `
content_collection: blog
has_feed: true
`)

  await write('blog/lifestyle/lifestyle.yaml', `
content_collection: blog  
has_feed: true
`)

  await write('blog/general-post.md', `---
title: General Post
date: 2024-01-10
description: A general blog post
---

# General Post
`)

  await write('blog/tech/tech-post.md', `---
title: Tech Post
date: 2024-01-15
description: A tech-related post
---

# Tech Post
`)

  await write('blog/lifestyle/lifestyle-post.md', `---
title: Lifestyle Post
date: 2024-01-20
description: A lifestyle post
---

# Lifestyle Post
`)

  const kit = await getKit(false)
  await kit.build()

  expect(existsSync(join(kit.dist, 'blog', 'feed.xml'))).toBe(true)
  expect(existsSync(join(kit.dist, 'blog', 'tech', 'feed.xml'))).toBe(true)
  expect(existsSync(join(kit.dist, 'blog', 'lifestyle', 'feed.xml'))).toBe(true)

  const parentFeed = await readDist(kit.dist, 'blog/feed.xml')
  expect(parentFeed).toContain('<title>My Site / Blog</title>')
  expect(parentFeed).toContain('General Post')
  // includes subcategory content
  expect(parentFeed).toContain('Tech Post')
  expect(parentFeed).toContain('Lifestyle Post')

  const techFeed = await readDist(kit.dist, 'blog/tech/feed.xml')
  expect(techFeed).toContain('<title>My Site / Blog → Tech</title>')
  expect(techFeed).toContain('Tech Post')
  expect(techFeed).not.toContain('General Post') // does not include parent content
  expect(techFeed).not.toContain('Lifestyle Post')

  const lifestyleFeed = await readDist(kit.dist, 'blog/lifestyle/feed.xml')
  expect(lifestyleFeed).toContain('<title>My Site / Blog → Lifestyle</title>')
  expect(lifestyleFeed).toContain('Lifestyle Post')
  expect(lifestyleFeed).not.toContain('General Post')
  expect(lifestyleFeed).not.toContain('Tech Post')
})

test('has_feed setting inherits from parent directories unless explicitly disabled', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)
  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)
  await write('blog/subcategory/subcategory.yaml', `
# No has_feed setting - should inherit from parent
`)
  await write('blog/no-feed/no-feed.yaml', `
has_feed: false
`)
  await write('blog/parent-post.md', `---
title: Parent Post
date: 2024-01-10
description: Parent post
---

# Parent Post
`)
  await write('blog/subcategory/child-post.md', `---
title: Child Post
date: 2024-01-15
description: Child post
---

# Child Post
`)
  await write('blog/no-feed/no-feed-post.md', `---
title: No Feed Post
date: 2024-01-20
description: No feed post
---

# No Feed Post
`)

  const kit = await getKit(false)
  await kit.build()

  expect(existsSync(join(kit.dist, 'blog', 'feed.xml'))).toBe(true) // explicitly
  expect(existsSync(join(kit.dist, 'blog', 'subcategory', 'feed.xml'))).toBe(true) // inherited
  expect(existsSync(join(kit.dist, 'blog', 'no-feed', 'feed.xml'))).toBe(false) // explicitly

  const parentFeed = await readDist(kit.dist, 'blog/feed.xml')
  expect(parentFeed).toContain('Parent Post')
  expect(parentFeed).toContain('Child Post') // inherited
  expect(parentFeed).not.toContain('No Feed Post') // explicitly

  const childFeed = await readDist(kit.dist, 'blog/subcategory/feed.xml')
  expect(childFeed).toContain('<title>Site / Blog → Subcategory</title>')
  expect(childFeed).toContain('Child Post')
  expect(childFeed).not.toContain('Parent Post') // no parent content
  expect(childFeed).not.toContain('No Feed Post')
})

test('parent/child directories `has_feed` settings work correctly', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

  await write('articles/articles.yaml', `
has_feed: true
`)
  await write('articles/tech/tech.yaml', `
has_feed: true
`)
  await write('articles/excluded/excluded.yaml', `
has_feed: false
`)
  await write('articles/drafts/drafts.yaml', `
`)
  await write('articles/main-article.md', `---
title: Main Article
date: 2024-01-10
description: Main article
---

# Main Article
`)
  await write('articles/tech/tech-article.md', `---
title: Tech Article
date: 2024-01-15
description: Tech article
---

# Tech Article
`)
  await write('articles/excluded/personal-article.md', `---
title: Personal Article
date: 2024-01-20
description: Personal article
---

# Personal Article
`)
  await write('articles/drafts/draft-article.md', `---
title: Draft Article
date: 2024-01-25
description: Draft article
---

# Draft Article
`)

  const kit = await getKit(false)
  await kit.build()

  expect(existsSync(join(kit.dist, 'articles', 'feed.xml'))).toBe(true) // explicit
  expect(existsSync(join(kit.dist, 'articles', 'tech', 'feed.xml'))).toBe(true) // explicit
  expect(existsSync(join(kit.dist, 'articles', 'personal', 'feed.xml'))).toBe(false) // explicit
  expect(existsSync(join(kit.dist, 'articles', 'drafts', 'feed.xml'))).toBe(true) // inherited

  const parentFeed = await readDist(kit.dist, 'articles/feed.xml')
  expect(parentFeed).toContain('<title>Site / Articles</title>')
  expect(parentFeed).toContain('Main Article')
  expect(parentFeed).toContain('Tech Article')
  expect(parentFeed).toContain('Draft Article')
  expect(parentFeed).not.toContain('Personal Article')

  const techFeed = await readDist(kit.dist, 'articles/tech/feed.xml')
  expect(techFeed).toContain('<title>Site / Articles → Tech</title>')
  expect(techFeed).toContain('Tech Article')
  expect(techFeed).not.toContain('Main Article')
  expect(techFeed).not.toContain('Personal Article')
  expect(techFeed).not.toContain('Draft Article')

  const draftsFeed = await readDist(kit.dist, 'articles/drafts/feed.xml')
  expect(draftsFeed).toContain('<title>Site / Articles → Drafts</title>')
  expect(draftsFeed).toContain('Draft Article')
  expect(draftsFeed).not.toContain('Main Article')
  expect(draftsFeed).not.toContain('Tech Article')
  expect(draftsFeed).not.toContain('Personal Article')
})

test('includes favicon from site.yaml in feed icon element', async () => {
  const validItem = {
    url: '/test/post.html',
    date: new Date('2024-01-15'),
    title: 'Test Post',
    description: 'Test description'
  }

  const dataWithFavicon = {
    title: 'test',
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    icon: 'img/favicon.ico',
    items: [validItem]
  }

  const feedWithFavicon = collectionToFeed(dataWithFavicon)
  expect(feedWithFavicon).toContain('<icon>https://test.com/img/favicon.ico</icon>')

  // no favicon
  const dataWithoutFavicon = {
    dir: 'test',
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    items: [validItem]
  }

  const [feedWithoutFavicon] = collectionToFeed(dataWithoutFavicon)
  expect(feedWithoutFavicon).not.toContain('<icon>')
  expect(feedWithoutFavicon).not.toContain('</icon>')
})

test('includes author name and email from site.yaml in entries', async () => {
  const validItem = {
    url: '/test/post.html',
    date: new Date('2024-01-15'),
    title: 'Test Post',
    description: 'Test description'
  }

  // author and email
  const dataWithAuthorAndEmail = {
    title: 'test',
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    author: {
      name: 'NickSdot',
      mail: 'nick@example.com',
    },
    items: [validItem]
  }

  const feedWithAuthor = collectionToFeed(dataWithAuthorAndEmail)
  expect(feedWithAuthor).toContain('<author><name>NickSdot</name><email>nick@example.com</email></author>')

  // no email
  const dataWithAuthorOnly = {
    dir: 'test',
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    author: {
      name: 'NickSdot',
    },
    items: [validItem]
  }

  const feedAuthorOnly = collectionToFeed(dataWithAuthorOnly)
  expect(feedAuthorOnly).toContain('<author><name>NickSdot</name></author>')
  expect(feedAuthorOnly).not.toContain('<email>')

  // no email
  const dataWithEntryOverride = {
    dir: 'test',
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    author: {
      name: 'NickSdot',
    },
    items: [{
      ...validItem,
      author: {
        name: 'SdotNick'
      },
    }]
  }

  const feedAuthorOverridden = collectionToFeed(dataWithEntryOverride)
  expect(feedAuthorOverridden).toContain('<author><name>SdotNick</name></author>')

  // no author
  const dataWithoutAuthor = {
    dir: 'test',
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    items: [validItem]
  }

  const feedWithoutAuthor = collectionToFeed(dataWithoutAuthor)
  expect(feedWithoutAuthor).not.toContain('</title>\\n<<author>')
})

test('generates valid feeds when optional undefined fields', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)
  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)
  await write('blog/post.md', `---
title: Test Post
date: 2024-01-15
description: Test description
---

# Test Post
`)

  const kit = await getKit(false)
  await kit.build()

  const minimalFeed = await readDist(kit.dist, 'blog/feed.xml')
  
  expect(minimalFeed).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(minimalFeed).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(minimalFeed).toContain('<title>Site / Blog</title>')
  expect(minimalFeed).toContain('<link href="https://example.com/blog/" rel="alternate"/>')
  expect(minimalFeed).toContain('<id>https://example.com/blog/feed.xml</id>')
  expect(minimalFeed).toContain('<generator uri="https://nuejs.org/" version="1.0.0">Nuekit</generator>')
  
  expect(minimalFeed).not.toContain('<icon>')
  expect(minimalFeed).not.toContain('<author>')
  
  expect(minimalFeed).toContain('<entry>')
  expect(minimalFeed).toContain('<title>Test Post</title>')
  expect(minimalFeed).toContain('Test description')
})

test('removes feed.xml files when has_feed changes to false', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

  // Step 1: Create collection with has_feed: true
  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  await write('blog/post.md', `---
title: Test Post
date: 2024-01-15
description: Test description
---

# Test Post
`)

  const kit1 = await getKit(false)
  await kit1.build()

  // feed exists
  expect(existsSync(join(kit1.dist, 'blog', 'feed.xml'))).toBe(true)
  const initialFeed = await readDist(kit1.dist, 'blog/feed.xml')
  expect(initialFeed).toContain('<title>Site / Blog</title>')

  // Step 2: Change has_feed to false
  await write('blog/blog.yaml', `
content_collection: blog
has_feed: false
`)

  const kit2 = await getKit(false)
  await kit2.build()

  // feed was removed
  expect(existsSync(join(kit2.dist, 'blog', 'feed.xml'))).toBe(false)

  // Step 3: undefined has_feed also removes
  await write('blog2/blog2.yaml', `
content_collection: blog2
has_feed: true
`)

  await write('blog2/post.md', `---
title: Test Post 2
date: 2024-01-15
description: Test description 2
---

# Test Post 2
`)

  const kit3 = await getKit(false)
  await kit3.build()

  // feed was created
  expect(existsSync(join(kit3.dist, 'blog2', 'feed.xml'))).toBe(true)

  // undefined has_feed
  await write('blog2/blog2.yaml', `
content_collection: blog2
`)

  const kit4 = await getKit(false)
  await kit4.build()

  // feed was removed when has_feed became undefined
  expect(existsSync(join(kit4.dist, 'blog2', 'feed.xml'))).toBe(false)
})

test('generates feeds during normal build process automatically', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
author: "Test Author"
favicon: img/favicon.ico
`)

  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  await write('news/news.yaml', `
content_collection: news
has_feed: true
`)

  await write('articles/articles.yaml', `
content_collection: articles
has_feed: false
`)

  await write('docs/docs.yaml', `
content_collection: docs
`)

  await write('blog/blog-post.md', `---
title: Blog Post
date: 2024-01-15
description: A blog post
---

# Blog Post
`)

  await write('news/news-item.md', `---
title: News Item
date: 2024-01-16
description: A news item
---

# News Item
`)

  await write('articles/article.md', `---
title: Article
date: 2024-01-17
description: An article
---

# Article
`)

  await write('docs/doc.md', `---
title: Documentation
date: 2024-01-18
description: A documentation page
---

# Documentation
`)

  const kit = await getKit(false)
  const builtPaths = await kit.build()

  expect(existsSync(join(kit.dist, 'blog', 'feed.xml'))).toBe(true)
  expect(existsSync(join(kit.dist, 'news', 'feed.xml'))).toBe(true)
  
  expect(existsSync(join(kit.dist, 'articles', 'feed.xml'))).toBe(false)
  expect(existsSync(join(kit.dist, 'docs', 'feed.xml'))).toBe(false)

  const blogFeed = await readDist(kit.dist, 'blog/feed.xml')
  expect(blogFeed).toContain('<title>Site / Blog</title>')
  expect(blogFeed).toContain('<author><name>Test Author</name></author>')
  expect(blogFeed).toContain('<icon>https://example.com/img/favicon.ico</icon>')
  expect(blogFeed).toContain('Blog Post')

  const expectedFiles = [
    'blog/blog-post.html',
    'blog/feed.xml',
    'news/news-item.html', 
    'news/feed.xml',
    'articles/article.html', // content but no feed
    'docs/doc.html' // content but no feed
  ]

  for (const file of expectedFiles) {
    expect(existsSync(join(kit.dist, file))).toBe(true)
  }
})

test('empty collections generate feed file without entries', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

  await write('empty-blog/empty-blog.yaml', `
content_collection: empty-blog
has_feed: true
`)

  await write('disabled-blog/disabled-blog.yaml', `
content_collection: disabled-blog
has_feed: false
`)

  await write('disabled-blog/post.md', `---
title: Disabled Post
date: 2024-01-15
description: This should not appear in any feed
---

# Disabled Post
`)

  const kit = await getKit(false)
  await kit.build()

  expect(existsSync(join(kit.dist, 'empty-blog', 'feed.xml'))).toBe(true)
  expect(existsSync(join(kit.dist, 'disabled-blog', 'feed.xml'))).toBe(false)

  // Verify empty feed content
  const emptyFeed = await readDist(kit.dist, 'empty-blog/feed.xml')
  expect(emptyFeed).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(emptyFeed).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(emptyFeed).toContain('<title>Site / Empty Blog</title>')
  expect(emptyFeed).not.toContain('<entry>') // no entries in empty collection

  const data = {
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    content_collection: 'empty',
    title: 'empty',
    link_self: 'https://test.com/empty/feed.xml',
    link_alternate: 'https://test.com/',
    items: []
  }

  const feedContent = collectionToFeed(data)
  
  expect(feedContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(feedContent).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(feedContent).toContain('<title>Site / Empty</title>')
  expect(feedContent).toContain('<id>https://test.com/empty/feed.xml</id>')
  expect(feedContent).toContain('<link href="https://test.com/" rel="alternate"/>')
  expect(feedContent).toContain('<link href="https://test.com/empty/feed.xml" rel="self" type="application/atom+xml"/>')
  expect(feedContent).not.toContain('<entry>')
  expect(feedContent).not.toContain('This should not appear in any feed')
  expect(feedContent).toContain('</feed>')
})

test('handles malformed item data gracefully', async () => {
  const minimalData = {
    origin: 'https://test.com',
    title_template: 'Site / %s',
    title: 'Test',
    nuekit_version: '1.0.0'
  }

  const validItem = {
    url: '/test/post.html',
    date: new Date('2024-01-15'),
    title: 'Test Post',
    description: 'Test description'
  }

  const itemsWithNulls = [
    validItem,
    {
      url: '/test/post2.html',
      date: null,
      title: '',
      description: null
    },
    {
      url: '/test/post3.html',
      date: 'invalid-date',
      title: 'Post 3',
      description: undefined
    },
    {
      url: '/test/post4.html',
      date: new Date('2024-01-20'),
      title: 'Very Long Title '.repeat(20), // Very long title
      description: 'Long description '.repeat(50) // Very long description
    }
  ]

  const feedContent = collectionToFeed({ ...minimalData, items: itemsWithNulls })

  // Should still generate valid feed
  expect(feedContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(feedContent).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(feedContent).toContain('<title>Site / Test</title>')
  
  // Contain entries, even with problematic data
  const entryMatches = feedContent.match(/<entry>/g)
  expect(entryMatches).toHaveLength(4)
  
  expect(feedContent).toContain('<title>Test Post</title>')
  expect(feedContent).toContain('<title></title>') // empty title handled
  expect(feedContent).toContain('<title>Post 3</title>')
  expect(feedContent).toContain('Very Long Title') // long title handled
  
  // null/invalid dates should fall back to current date
  const publishedMatches = feedContent.match(/<published>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z<\/published>/g)
  expect(publishedMatches).toHaveLength(4)
  
  // All entries should have valid URLs even with problematic data
  expect(feedContent).toContain('https://test.com/test/post.html')
  expect(feedContent).toContain('https://test.com/test/post2.html')
  expect(feedContent).toContain('https://test.com/test/post3.html')
  expect(feedContent).toContain('https://test.com/test/post4.html')
})

test('requires essential fields for usable feed generation', async () => {
  const validItem = {
    url: '/test/post.html',
    date: new Date('2024-01-15'),
    title: 'Test Post',
    description: 'Test description'
  }

  // Test that origin is required for usable feeds
  const feedWithoutOrigin = collectionToFeed({ 
    title: 'test',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    items: [validItem] 
  })
  
  // Feed generates but URLs are broken todo: how to handle this?
  expect(feedWithoutOrigin).toContain('undefined/test/')
  expect(feedWithoutOrigin).toContain('<link href="undefined/test/post.html"/>')
  
  // This demonstrates that origin is effectively required for a usable feed
  // Feed readers would not be able to use these URLs
  
  // Test with minimal required fields for usable feed
  const usableFeed = collectionToFeed({
    title: 'test',
    origin: 'https://test.com',
    items: [validItem]
  })
  
  // Should generate valid URLs even without title_template
  expect(usableFeed).toContain('https://test.com/test/')
  expect(usableFeed).toContain('<link href="https://test.com/test/post.html"/>')
  expect(usableFeed).toContain('<title>Test</title>') // fallback title generation
})

test('generates feeds for deeply nested directory structures with mixed configurations', async () => {
  await write('site.yaml', `
origin: https://example.com
title_template: "Complex Site / %s"
author: "Site Author"
favicon: /favicon.ico
`)

  await write('index.md', `
---
content_collection: content
---
`)

  await write('content/content.yaml', `
has_feed: true
`)

  await write('content/tech/tech.yaml', `
has_feed: true
`)

  await write('content/tech/web-dev/web-dev.yaml', `
# No has_feed setting - should inherit from parent
`)

  await write('content/tech/mobile/mobile.yaml', `
has_feed: false
`)

  await write('content/design/design.yaml', `
# No has_feed setting - should inherit from root
`)

  await write('content/tech/web-dev/frontend/frontend.yaml', `
has_feed: true
`)

  await write('content/root-post.md', `---
title: Root Content Post
date: 2024-01-10
description: A root level post
---

# Root Content
`)

  await write('content/tech/tech-post.md', `---
title: Tech Post
date: 2024-01-15
description: A technology post
---

# Tech Post
`)

  await write('content/tech/web-dev/webdev-post.md', `---
title: Web Dev Post
date: 2024-01-20
description: A web development post
---

# Web Dev Post
`)

  await write('content/tech/mobile/mobile-post.md', `---
title: Mobile Post
date: 2024-01-25
description: A mobile development post
---

# Mobile Post
`)

  await write('content/design/design-post.md', `---
title: Design Post
date: 2024-01-30
description: A design post
---

# Design Post
`)

  await write('content/tech/web-dev/frontend/frontend-post.md', `---
title: Frontend Post
date: 2024-02-01
description: A frontend development post
---

# Frontend Post
`)

  const kit = await getKit(false)
  await kit.build()

  expect(existsSync(join(kit.dist, 'content', 'feed.xml'))).toBe(true) // explicit
  expect(existsSync(join(kit.dist, 'content', 'tech', 'feed.xml'))).toBe(true) // explicit
  expect(existsSync(join(kit.dist, 'content', 'tech', 'web-dev', 'feed.xml'))).toBe(true) // inherited
  expect(existsSync(join(kit.dist, 'content', 'tech', 'mobile', 'feed.xml'))).toBe(false) // explicit
  expect(existsSync(join(kit.dist, 'content', 'design', 'feed.xml'))).toBe(true) // inherited
  expect(existsSync(join(kit.dist, 'content', 'tech', 'web-dev', 'frontend', 'feed.xml'))).toBe(true) // explicit

  const rootFeed = await readDist(kit.dist, 'content/feed.xml')
  expect(rootFeed).toContain('<title>Complex Site / Content</title>')
  expect(rootFeed).toContain('Root Content Post')
  expect(rootFeed).toContain('Tech Post')
  expect(rootFeed).toContain('Web Dev Post')

  const techFeed = await readDist(kit.dist, 'content/tech/feed.xml')
  expect(techFeed).toContain('<title>Complex Site / Content → Tech</title>') // custom
  expect(techFeed).not.toContain('<subtitle>')
  expect(techFeed).toContain('Tech Post')
  expect(techFeed).toContain('Web Dev Post')
  expect(techFeed).not.toContain('Root Content Post')

  const webdevFeed = await readDist(kit.dist, 'content/tech/web-dev/feed.xml')
  expect(webdevFeed).toContain('<title>Complex Site / Content → Tech → Web Dev</title>') // generated
  expect(webdevFeed).toContain('Web Dev Post')
  expect(webdevFeed).toContain('Frontend Post')
  expect(webdevFeed).not.toContain('Tech Post')

  const designFeed = await readDist(kit.dist, 'content/design/feed.xml')
  expect(designFeed).toContain('<title>Complex Site / Content → Design</title>')
  expect(designFeed).toContain('Design Post')
  expect(designFeed).not.toContain('Root Content Post')

  const frontendFeed = await readDist(kit.dist, 'content/tech/web-dev/frontend/feed.xml')
  expect(frontendFeed).toContain('<title>Complex Site / Content → Tech → Web Dev → Frontend</title>') // custom
  expect(frontendFeed).toContain('Frontend Post')
  expect(frontendFeed).not.toContain('Web Dev Post')

  const allFeeds = [rootFeed, techFeed, webdevFeed, designFeed, frontendFeed]
  const allPosts = ['Root Content Post', 'Tech Post', 'Web Dev Post', 'Design Post', 'Frontend Post']

  expect(allPosts.filter(post => rootFeed.includes(post))).toHaveLength(5)
  expect(allPosts.filter(post => techFeed.includes(post))).toHaveLength(3)
  expect(allPosts.filter(post => webdevFeed.includes(post))).toHaveLength(2)
  expect(allPosts.filter(post => designFeed.includes(post))).toHaveLength(1)
  expect(allPosts.filter(post => frontendFeed.includes(post))).toHaveLength(1)
})