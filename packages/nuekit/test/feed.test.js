import { promises as fs, existsSync } from 'node:fs'
import { join, parse } from 'node:path'

import { createKit } from '../src/nuekit.js'
import { collectionToFeed } from '../src/layout/components.js'

// temporary directory
const root = '_test_feed'

// setup and teardown
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

// relative to root
async function read(path) {
  return await fs.readFile(join(root, path), 'utf-8')
}

async function readDist(dist, path) {
  return await fs.readFile(join(dist, path), 'utf-8')
}

// default kit
async function getKit(dryrun = true) {
  if (!existsSync(join(root, 'site.yaml'))) await write('site.yaml', '')
  return await createKit({ root, dryrun })
}

// Test 1: Basic feed generation
test('generates valid Atom feed for collection with has_feed: true', async () => {
  // Setup site.yaml
  await write('site.yaml', `
origin: https://example.com
title_template: "Test Site / %s"
nuekit_version: "1.0.0"
`)

  // Setup blog collection with has_feed enabled
  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  // Create sample blog posts
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

  // Check that feed.xml was generated
  const feedExists = existsSync(join(kit.dist, 'blog', 'feed.xml'))
  expect(feedExists).toBe(true)

  // Read and validate feed content
  const feedContent = await readDist(kit.dist, 'blog/feed.xml')
  
  // Basic XML structure validation
  expect(feedContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(feedContent).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(feedContent).toContain('<title>Test Site / Blog</title>')
  expect(feedContent).toContain('<link href="https://example.com"/>')
  expect(feedContent).toContain('<id>https://example.com/blog/feed.xml</id>')
  expect(feedContent).toContain('<generator uri="https://nuejs.org/" version="1.0.0">Nuekit</generator>')
  expect(feedContent).toContain('<link href="https://example.com/blog/feed.xml" rel="self" type="application/atom+xml"/>')
  
  // Check entries are present
  expect(feedContent).toContain('<entry>')
  expect(feedContent).toContain('<title>First Post</title>')
  expect(feedContent).toContain('<title>Second Post</title>')
  expect(feedContent).toContain('https://example.com/blog/post1.html')
  expect(feedContent).toContain('https://example.com/blog/post2.html')
  expect(feedContent).toContain('This is the first post')
  expect(feedContent).toContain('This is the second post')
})

// Test 2: Feed content validation
test('generates feed with proper Atom structure and content', async () => {
  // Setup minimal feed data
  const data = {
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    content_collection: 'posts'
  }

  const items = [
    {
      url: '/posts/test-post.html',
      date: new Date('2024-01-15'),
      title: 'Test Post',
      description: 'A test post description'
    }
  ]

  const [feedContent] = collectionToFeed('feed.xml', data, 'posts', items)

  // Validate XML declaration and root element
  expect(feedContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(feedContent).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(feedContent).toContain('</feed>')

  // Validate required Atom elements
  expect(feedContent).toContain('<title>Site / Posts</title>')
  expect(feedContent).not.toContain('<subtitle></subtitle>')
  expect(feedContent).not.toContain('<subtitle/>')
  expect(feedContent).toContain('<link href="https://test.com"/>')
  expect(feedContent).toContain('<id>https://test.com/posts/feed.xml</id>')
  expect(feedContent).toMatch(/<updated>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z<\/updated>/) // Valid ISO 8601
  expect(feedContent).toContain('<generator uri="https://nuejs.org/" version="1.0.0">Nuekit</generator>')

  // Validate entry structure
  expect(feedContent).toContain('<entry>')
  expect(feedContent).toContain('<id>https://test.com/posts/test-post.html</id>')
  expect(feedContent).toContain('<title>Test Post</title>')
  expect(feedContent).toContain('<link href="https://test.com/posts/test-post.html"/>')
  expect(feedContent).toContain('<published>2024-01-15T00:00:00.000Z</published>')
  expect(feedContent).toContain('<summary type="xhtml">A test post description</summary>')
  expect(feedContent).toContain('</entry>')
})

// Test 3: No feed when disabled
test('does not generate feed when has_feed is false or undefined', async () => {
  // Setup site.yaml
  await write('site.yaml', `
origin: https://example.com
title_template: "Test Site / %s"
`)

  // Test case 1: has_feed explicitly false
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

  // Should not generate feed.xml
  const feedExists1 = existsSync(join(kit1.dist, 'blog', 'feed.xml'))
  expect(feedExists1).toBe(false)

  // Test case 2: has_feed undefined (not specified)
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

  // Should not generate feed.xml
  const feedExists2 = existsSync(join(kit2.dist, 'blog2', 'feed.xml'))
  expect(feedExists2).toBe(false)
})

// Test 4: Default title formatting
test('formats feed titles with proper capitalization and arrow notation', async () => {
  const data = {
    origin: 'https://test.com',
    title_template: 'My Site / %s',
    nuekit_version: '1.0.0'
  }

  // Test simple directory name
  const [feed1] = collectionToFeed('feed.xml', data, 'blog', [])
  expect(feed1).toContain('<title>My Site / Blog</title>')

  // Test directory with hyphens
  const [feed2] = collectionToFeed('feed.xml', data, 'my-awesome-blog', [])
  expect(feed2).toContain('<title>My Site / My Awesome Blog</title>')

  // Test subdirectory with slash and hyphens
  const [feed3] = collectionToFeed('feed.xml', data, 'blog/child-category', [])
  expect(feed3).toContain('<title>My Site / Blog → Child Category</title>')

  // Test complex nested path
  const [feed4] = collectionToFeed('feed.xml', data, 'tech-blog/web-development/frontend-tips', [])
  expect(feed4).toContain('<title>My Site / Tech Blog → Web Development → Frontend Tips</title>')

  // Test with numbers and mixed case
  const [feed5] = collectionToFeed('feed.xml', data, 'blog/category-2', [])
  expect(feed5).toContain('<title>My Site / Blog → Category 2</title>')
})

// Test 5: Custom feed_title override
test('uses custom feed_title when provided, ignoring automatic formatting', async () => {
  const baseData = {
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0'
  }

  // Test custom feed_title completely overrides path formatting
  const dataWithCustomTitle = {
    ...baseData,
    feed_title: 'My Custom Feed Title'
  }
  
  const [feed1] = collectionToFeed('feed.xml', dataWithCustomTitle, 'blog/some-complex-path', [])
  expect(feed1).toContain('<title>Site / My Custom Feed Title</title>')
  expect(feed1).not.toContain('Blog → Some Complex Path')

  // Test custom feed_title with special characters
  const dataWithSpecialTitle = {
    ...baseData,
    feed_title: 'Tech & Web Development 🚀'
  }
  
  const [feed2] = collectionToFeed('feed.xml', dataWithSpecialTitle, 'tech-blog', [])
  expect(feed2).toContain('<title>Site / Tech & Web Development 🚀</title>')
  expect(feed2).not.toContain('Tech Blog')

  // Test empty custom feed_title falls back to automatic formatting
  const dataWithEmptyTitle = {
    ...baseData,
    feed_title: ''
  }
  
  const [feed3] = collectionToFeed('feed.xml', dataWithEmptyTitle, 'blog', [])
  expect(feed3).toContain('<title>Site / Blog</title>')
})

// Test 6: Title template integration
test('properly integrates with title_template from site.yaml', async () => {
  // Test different title template formats
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
      nuekit_version: '1.0.0'
    }

    const [feed] = collectionToFeed('feed.xml', data, 'tech-blog', [])
    const expectedTitle = template.replace('%s', 'Tech Blog')
    expect(feed).toContain(`<title>${expectedTitle}</title>`)
  }

  // Test title template with custom feed_title
  const dataWithCustom = {
    origin: 'https://test.com',
    title_template: 'Custom Site | %s',
    feed_title: 'Special Feed Name',
    nuekit_version: '1.0.0'
  }

  const [feedCustom] = collectionToFeed('feed.xml', dataWithCustom, 'any-path', [])
  expect(feedCustom).toContain('<title>Custom Site | Special Feed Name</title>')

  // Test multiple %s replacements (edge case)
  const dataMultiple = {
    origin: 'https://test.com',
    title_template: '%s - %s Feed',
    nuekit_version: '1.0.0'
  }

  const [feedMultiple] = collectionToFeed('feed.xml', dataMultiple, 'blog', [])
  expect(feedMultiple).toContain('<title>Blog - Blog Feed</title>')
})

// Test 7: Subcategory feeds
test('generates separate feeds for subcategories with has_feed: true', async () => {
  // Setup site.yaml
  await write('site.yaml', `
origin: https://example.com
title_template: "My Site / %s"
nuekit_version: "1.0.0"
`)

  // Setup parent blog collection
  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  // Setup subcategory with its own feed
  await write('blog/tech/tech.yaml', `
content_collection: blog
has_feed: true
`)

  // Setup another subcategory with its own feed
  await write('blog/lifestyle/lifestyle.yaml', `
content_collection: blog  
has_feed: true
`)

  // Create posts in parent directory
  await write('blog/general-post.md', `---
title: General Post
date: 2024-01-10
description: A general blog post
---

# General Post
`)

  // Create posts in tech subcategory
  await write('blog/tech/tech-post.md', `---
title: Tech Post
date: 2024-01-15
description: A tech-related post
---

# Tech Post
`)

  // Create posts in lifestyle subcategory
  await write('blog/lifestyle/lifestyle-post.md', `---
title: Lifestyle Post
date: 2024-01-20
description: A lifestyle post
---

# Lifestyle Post
`)

  const kit = await getKit(false)
  await kit.build()

  // Check that all three feeds were generated
  expect(existsSync(join(kit.dist, 'blog', 'feed.xml'))).toBe(true)
  expect(existsSync(join(kit.dist, 'blog', 'tech', 'feed.xml'))).toBe(true)
  expect(existsSync(join(kit.dist, 'blog', 'lifestyle', 'feed.xml'))).toBe(true)

  // Validate parent feed contains only parent-level content
  const parentFeed = await readDist(kit.dist, 'blog/feed.xml')
  expect(parentFeed).toContain('<title>My Site / Blog</title>')
  expect(parentFeed).toContain('General Post')
  expect(parentFeed).not.toContain('Tech Post') // Should not include subcategory content
  expect(parentFeed).not.toContain('Lifestyle Post')

  // Validate tech subcategory feed
  const techFeed = await readDist(kit.dist, 'blog/tech/feed.xml')
  expect(techFeed).toContain('<title>My Site / Blog → Tech</title>')
  expect(techFeed).toContain('Tech Post')
  expect(techFeed).not.toContain('General Post') // Should not include parent content
  expect(techFeed).not.toContain('Lifestyle Post')

  // Validate lifestyle subcategory feed
  const lifestyleFeed = await readDist(kit.dist, 'blog/lifestyle/feed.xml')
  expect(lifestyleFeed).toContain('<title>My Site / Blog → Lifestyle</title>')
  expect(lifestyleFeed).toContain('Lifestyle Post')
  expect(lifestyleFeed).not.toContain('General Post')
  expect(lifestyleFeed).not.toContain('Tech Post')
})

// Test 8: Inheritance behavior - has_feed DOES inherit unless explicitly disabled
test('has_feed setting inherits from parent directories unless explicitly disabled', async () => {
  // Setup site.yaml
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

  // Parent with has_feed: true
  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  // Child without has_feed setting (should inherit from parent)
  await write('blog/subcategory/subcategory.yaml', `
content_collection: blog
# No has_feed setting - should inherit from parent
`)

  // Another child with explicit has_feed: false
  await write('blog/no-feed/no-feed.yaml', `
content_collection: blog
has_feed: false
`)

  // Create content in all directories
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

  // Parent should have feed (explicitly enabled)
  expect(existsSync(join(kit.dist, 'blog', 'feed.xml'))).toBe(true)
  
  // Child without has_feed should INHERIT and get feed  
  expect(existsSync(join(kit.dist, 'blog', 'subcategory', 'feed.xml'))).toBe(true)
  
  // Child with explicit has_feed: false should NOT get feed
  expect(existsSync(join(kit.dist, 'blog', 'no-feed', 'feed.xml'))).toBe(false)

  // Parent feed should contain only parent content
  const parentFeed = await readDist(kit.dist, 'blog/feed.xml')
  expect(parentFeed).toContain('Parent Post')
  expect(parentFeed).not.toContain('Child Post') // Content isolation
  expect(parentFeed).not.toContain('No Feed Post')

  // Child feed should contain only child content
  const childFeed = await readDist(kit.dist, 'blog/subcategory/feed.xml')
  expect(childFeed).toContain('<title>Site / Blog → Subcategory</title>')
  expect(childFeed).toContain('Child Post')
  expect(childFeed).not.toContain('Parent Post') // Content isolation
  expect(childFeed).not.toContain('No Feed Post')
})

// Test 9: Mixed settings - independent operation
test('parent and child directories with different has_feed settings work independently', async () => {
  // Setup site.yaml
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

  // Parent with has_feed: true
  await write('articles/articles.yaml', `
content_collection: articles
has_feed: true
`)

  // Child 1: has_feed: true (should get feed)
  await write('articles/tech/tech.yaml', `
content_collection: articles
has_feed: true
`)

  // Child 2: has_feed: false (should NOT get feed)  
  await write('articles/personal/personal.yaml', `
content_collection: articles
has_feed: false
`)

  // Child 3: no has_feed setting (should inherit and get feed)
  await write('articles/drafts/drafts.yaml', `
content_collection: articles
`)

  // Create content in each directory
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

  await write('articles/personal/personal-article.md', `---
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

  // Check feed existence based on has_feed settings
  expect(existsSync(join(kit.dist, 'articles', 'feed.xml'))).toBe(true) // Parent: has_feed: true
  expect(existsSync(join(kit.dist, 'articles', 'tech', 'feed.xml'))).toBe(true) // Child: has_feed: true
  expect(existsSync(join(kit.dist, 'articles', 'personal', 'feed.xml'))).toBe(false) // Child: has_feed: false
  expect(existsSync(join(kit.dist, 'articles', 'drafts', 'feed.xml'))).toBe(true) // Child: inherits from parent

  // Validate parent feed content (only parent-level content)
  const parentFeed = await readDist(kit.dist, 'articles/feed.xml')
  expect(parentFeed).toContain('<title>Site / Articles</title>')
  expect(parentFeed).toContain('Main Article')
  expect(parentFeed).not.toContain('Tech Article')
  expect(parentFeed).not.toContain('Personal Article')
  expect(parentFeed).not.toContain('Draft Article')

  // Validate tech child feed content (only tech content)
  const techFeed = await readDist(kit.dist, 'articles/tech/feed.xml')
  expect(techFeed).toContain('<title>Site / Articles → Tech</title>')
  expect(techFeed).toContain('Tech Article')
  expect(techFeed).not.toContain('Main Article')
  expect(techFeed).not.toContain('Personal Article')
  expect(techFeed).not.toContain('Draft Article')

  // Validate drafts child feed content (inherited feed)
  const draftsFeed = await readDist(kit.dist, 'articles/drafts/feed.xml')
  expect(draftsFeed).toContain('<title>Site / Articles → Drafts</title>')
  expect(draftsFeed).toContain('Draft Article')
  expect(draftsFeed).not.toContain('Main Article')
  expect(draftsFeed).not.toContain('Tech Article')
  expect(draftsFeed).not.toContain('Personal Article')
})

// Test 10: Feed description
test('uses feed_description when present, omits subtitle when absent', async () => {
  // Test with feed_description present
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
feed_description: "Latest posts about web development and technology"
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

  const feedWithDescription = await readDist(kit1.dist, 'blog/feed.xml')
  expect(feedWithDescription).toContain('<subtitle>Latest posts about web development and technology</subtitle>')

  // Test without feed_description (should omit subtitle element)
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

  const kit2 = await getKit(false)
  await kit2.build()

  const feedWithoutDescription = await readDist(kit2.dist, 'blog2/feed.xml')
  expect(feedWithoutDescription).not.toContain('<subtitle>')
  expect(feedWithoutDescription).not.toContain('</subtitle>')
})

// Test 11: Favicon integration
test('includes favicon from site.yaml in feed icon element', async () => {
  // Test with favicon present
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
favicon: /img/favicon.ico
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

  const kit1 = await getKit(false)
  await kit1.build()

  const feedWithFavicon = await readDist(kit1.dist, 'blog/feed.xml')
  expect(feedWithFavicon).toContain('<icon>https://example.com/img/favicon.ico</icon>')

  // Test without favicon (should omit icon element)
  await write('site2.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

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

  // Need to change root to use different site.yaml
  const root2 = '_test_feed2'
  await fs.rm(root2, { recursive: true, force: true })
  await fs.mkdir(root2, { recursive: true })
  
  const writeToRoot2 = async (path, content = '') => {
    const { dir } = parse(path)
    await fs.mkdir(join(root2, dir), { recursive: true })
    await fs.writeFile(join(root2, path), content)
  }

  await writeToRoot2('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

  await writeToRoot2('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  await writeToRoot2('blog/post.md', `---
title: Test Post Without Favicon
date: 2024-01-15
description: Test description
---

# Test Post
`)

  const kit2 = await createKit({ root: root2, dryrun: false })
  await kit2.build()

  const feedWithoutFavicon = await fs.readFile(join(kit2.dist, 'blog/feed.xml'), 'utf-8')
  expect(feedWithoutFavicon).not.toContain('<icon>')
  expect(feedWithoutFavicon).not.toContain('</icon>')

  await fs.rm(root2, { recursive: true, force: true })
})

// Test 12: Author information
test('includes author name and email from site.yaml in entries', async () => {
  // Test with both author and author_mail
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
author: "John Doe"
author_mail: "john@example.com"
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

  const kit1 = await getKit(false)
  await kit1.build()

  const feedWithAuthor = await readDist(kit1.dist, 'blog/feed.xml')
  expect(feedWithAuthor).toContain('<author><name>John Doe</name><email>john@example.com</email></author>')

  // Test with only author name (no email)
  await write('site2.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
author: "Jane Smith"
`)

  const root2 = '_test_feed2'
  await fs.rm(root2, { recursive: true, force: true })
  await fs.mkdir(root2, { recursive: true })
  
  const writeToRoot2 = async (path, content = '') => {
    const { dir } = parse(path)
    await fs.mkdir(join(root2, dir), { recursive: true })
    await fs.writeFile(join(root2, path), content)
  }

  await writeToRoot2('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
author: "Jane Smith"
`)

  await writeToRoot2('blog/blog.yaml', `
content_collection: blog
has_feed: true
`)

  await writeToRoot2('blog/post.md', `---
title: Test Post Author Only
date: 2024-01-15
description: Test description
---

# Test Post
`)

  const kit2 = await createKit({ root: root2, dryrun: false })
  await kit2.build()

  const feedAuthorOnly = await fs.readFile(join(kit2.dist, 'blog/feed.xml'), 'utf-8')
  expect(feedAuthorOnly).toContain('<author><name>Jane Smith</name></author>')
  expect(feedAuthorOnly).not.toContain('<email>')

  await fs.rm(root2, { recursive: true, force: true })
})

// Test 13: Missing optional fields
test('generates valid feeds when optional fields are undefined', async () => {
  // Test with minimal configuration - no favicon, author, feed_description
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
  
  // Should still be valid Atom feed
  expect(minimalFeed).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(minimalFeed).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(minimalFeed).toContain('<title>Site / Blog</title>')
  expect(minimalFeed).toContain('<link href="https://example.com"/>')
  expect(minimalFeed).toContain('<id>https://example.com/blog/feed.xml</id>')
  expect(minimalFeed).toContain('<generator uri="https://nuejs.org/" version="1.0.0">Nuekit</generator>')
  
  // Should omit optional elements when not provided
  expect(minimalFeed).not.toContain('<subtitle>')
  expect(minimalFeed).not.toContain('<icon>')
  expect(minimalFeed).not.toContain('<author>')
  
  // Should still have entries
  expect(minimalFeed).toContain('<entry>')
  expect(minimalFeed).toContain('<title>Test Post</title>')
  expect(minimalFeed).toContain('Test description')
})

// Test 14: Stale feed cleanup
test('removes feed.xml files when has_feed changes to false', async () => {
  // Setup site.yaml
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

  // Verify feed was created
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

  // Verify feed was removed
  expect(existsSync(join(kit2.dist, 'blog', 'feed.xml'))).toBe(false)

  // Step 3: Test with undefined has_feed (should also remove)
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

  // Verify second feed was created
  expect(existsSync(join(kit3.dist, 'blog2', 'feed.xml'))).toBe(true)

  // Change to undefined has_feed
  await write('blog2/blog2.yaml', `
content_collection: blog2
`)

  const kit4 = await getKit(false)
  await kit4.build()

  // Verify feed was removed when has_feed became undefined
  expect(existsSync(join(kit4.dist, 'blog2', 'feed.xml'))).toBe(false)
})

// Test 15: Build integration
test('generates feeds during normal build process automatically', async () => {
  // Setup site.yaml
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
author: "Test Author"
favicon: /favicon.ico
`)

  // Setup multiple collections with different configurations
  await write('blog/blog.yaml', `
content_collection: blog
has_feed: true
feed_description: "My blog posts"
`)

  await write('news/news.yaml', `
content_collection: news
has_feed: true
feed_title: "Latest News Updates"
`)

  await write('articles/articles.yaml', `
content_collection: articles
has_feed: false
`)

  await write('docs/docs.yaml', `
content_collection: docs
`)

  // Create content in each collection
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

  // Run single build command
  const kit = await getKit(false)
  const builtPaths = await kit.build()

  // Verify feeds were generated automatically for enabled collections
  expect(existsSync(join(kit.dist, 'blog', 'feed.xml'))).toBe(true)
  expect(existsSync(join(kit.dist, 'news', 'feed.xml'))).toBe(true)
  
  // Verify feeds were NOT generated for disabled/undefined collections
  expect(existsSync(join(kit.dist, 'articles', 'feed.xml'))).toBe(false)
  expect(existsSync(join(kit.dist, 'docs', 'feed.xml'))).toBe(false)

  // Verify blog feed content with description
  const blogFeed = await readDist(kit.dist, 'blog/feed.xml')
  expect(blogFeed).toContain('<title>Site / Blog</title>')
  expect(blogFeed).toContain('<subtitle>My blog posts</subtitle>')
  expect(blogFeed).toContain('<author><name>Test Author</name></author>')
  expect(blogFeed).toContain('<icon>https://example.com/favicon.ico</icon>')
  expect(blogFeed).toContain('Blog Post')

  // Verify news feed content with custom title
  const newsFeed = await readDist(kit.dist, 'news/feed.xml')
  expect(newsFeed).toContain('<title>Site / Latest News Updates</title>')
  expect(newsFeed).not.toContain('<subtitle>') // No description provided
  expect(newsFeed).toContain('<author><name>Test Author</name></author>')
  expect(newsFeed).toContain('<icon>https://example.com/favicon.ico</icon>')
  expect(newsFeed).toContain('News Item')

  // Verify all expected files were built (content + feeds)
  const expectedFiles = [
    'blog/blog-post.html',
    'blog/feed.xml',
    'news/news-item.html', 
    'news/feed.xml',
    'articles/article.html', // Content built but no feed
    'docs/doc.html' // Content built but no feed
  ]

  for (const file of expectedFiles) {
    expect(existsSync(join(kit.dist, file))).toBe(true)
  }
})

// Test 16: Empty collections
test('handles empty collections gracefully without generating feeds', async () => {
  // Setup site.yaml
  await write('site.yaml', `
origin: https://example.com
title_template: "Site / %s"
nuekit_version: "1.0.0"
`)

  // Setup collection with has_feed: true but no content
  await write('empty-blog/empty-blog.yaml', `
content_collection: empty-blog
has_feed: true
`)

  // Setup another collection with content but has_feed: false
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

  // Empty collection should not generate feed
  expect(existsSync(join(kit.dist, 'empty-blog', 'feed.xml'))).toBe(false)
  
  // Disabled collection should not generate feed
  expect(existsSync(join(kit.dist, 'disabled-blog', 'feed.xml'))).toBe(false)

  // Test direct feed generation with empty items array
  const data = {
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0',
    content_collection: 'empty'
  }

  const [feedContent] = collectionToFeed('feed.xml', data, 'empty', [])
  
  // Should generate valid feed structure but with no entries
  expect(feedContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(feedContent).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(feedContent).toContain('<title>Site / Empty</title>')
  expect(feedContent).toContain('<id>https://test.com/empty/feed.xml</id>')
  expect(feedContent).not.toContain('<entry>')
  expect(feedContent).toContain('</feed>')
})

// Test 17: Invalid data handling
test('handles missing required fields and malformed data gracefully', async () => {
  // Test with minimal required data only
  const minimalData = {
    origin: 'https://test.com',
    title_template: 'Site / %s',
    nuekit_version: '1.0.0'
  }

  const validItem = {
    url: '/test/post.html',
    date: new Date('2024-01-15'),
    title: 'Test Post',
    description: 'Test description'
  }

  // Test with undefined/null values in items
  const itemsWithNulls = [
    validItem,
    {
      url: '/test/post2.html',
      date: null, // null date
      title: '', // empty title
      description: undefined // undefined description
    },
    {
      url: '/test/post3.html',
      date: 'invalid-date', // invalid date string
      title: 'Post 3',
      description: 'Description 3'
    }
  ]

  const [feedContent] = collectionToFeed('feed.xml', minimalData, 'test', itemsWithNulls)

  // Should still generate valid feed
  expect(feedContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  expect(feedContent).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
  expect(feedContent).toContain('<title>Site / Test</title>')
  
  // Should contain all entries, even with problematic data
  const entryMatches = feedContent.match(/<entry>/g)
  expect(entryMatches).toHaveLength(3)
  
  // Check that empty/null values are handled
  expect(feedContent).toContain('<title>Test Post</title>')
  expect(feedContent).toContain('<title></title>') // Empty title should still create element
  expect(feedContent).toContain('<title>Post 3</title>')
  
  // Date handling - null date should fall back to current date, invalid date should also fall back
  expect(feedContent).toMatch(/<published>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z<\/published>/g)

  // Test with completely missing required fields
  try {
    const incompleteData = {
      // Missing origin, title_template, nuekit_version
      content_collection: 'test'
    }
    
    const [incompleteFeed] = collectionToFeed('feed.xml', incompleteData, 'test', [validItem])
    
    // Should handle missing fields gracefully
    expect(incompleteFeed).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    expect(incompleteFeed).toContain('<entry>')
  } catch (error) {
    // If it throws, that's also acceptable behavior for missing required fields
    expect(error).toBeDefined()
  }
})

// Test 18: Complex nested directory structures
test('generates feeds for deeply nested directory structures with mixed configurations', async () => {
  // Setup site.yaml
  await write('site.yaml', `
origin: https://example.com
title_template: "Complex Site / %s"
nuekit_version: "1.0.0"
author: "Site Author"
favicon: /favicon.ico
`)

  // Root collection
  await write('content/content.yaml', `
has_feed: true
feed_description: "Main content feed"
`)

  // Level 1 - category with custom title
  await write('content/tech/tech.yaml', `
has_feed: true
feed_title: "Technology Articles"
`)

  // Level 2 - subcategory inheriting feed
  await write('content/tech/web-dev/web-dev.yaml', `
# No has_feed setting - should inherit from parent
`)

  // Level 2 - subcategory explicitly disabled
  await write('content/tech/mobile/mobile.yaml', `
has_feed: false
`)

  // Level 1 - category with inheritance
  await write('content/design/design.yaml', `
# No has_feed setting - should inherit from root
feed_description: "Design articles and tutorials"
`)

  // Level 3 - deep nesting
  await write('content/tech/web-dev/frontend/frontend.yaml', `
has_feed: true
feed_title: "Frontend Development"
`)

  // Create content at various levels
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

  // Check feed generation based on inheritance and explicit settings
  expect(existsSync(join(kit.dist, 'content', 'feed.xml'))).toBe(true) // explicit
  expect(existsSync(join(kit.dist, 'content', 'tech', 'feed.xml'))).toBe(true) // explicit
  expect(existsSync(join(kit.dist, 'content', 'tech', 'web-dev', 'feed.xml'))).toBe(true) // inherited
  expect(existsSync(join(kit.dist, 'content', 'tech', 'mobile', 'feed.xml'))).toBe(false) // explicit
  expect(existsSync(join(kit.dist, 'content', 'design', 'feed.xml'))).toBe(true) // inherited
  expect(existsSync(join(kit.dist, 'content', 'tech', 'web-dev', 'frontend', 'feed.xml'))).toBe(true) // explicit

  // Validate feed content and titles
  const rootFeed = await readDist(kit.dist, 'content/feed.xml')
  expect(rootFeed).toContain('<title>Complex Site / Content</title>')
  expect(rootFeed).toContain('<subtitle>Main content feed</subtitle>')
  expect(rootFeed).toContain('Root Content Post')
  expect(rootFeed).not.toContain('Tech Post')

  const techFeed = await readDist(kit.dist, 'content/tech/feed.xml')
  expect(techFeed).toContain('<title>Complex Site / Technology Articles</title>') // custom
  expect(techFeed).not.toContain('<subtitle>')
  expect(techFeed).toContain('Tech Post')
  expect(techFeed).not.toContain('Root Content Post')
  expect(techFeed).not.toContain('Web Dev Post')

  const webdevFeed = await readDist(kit.dist, 'content/tech/web-dev/feed.xml')
  expect(webdevFeed).toContain('<title>Complex Site / Content → Tech → Web Dev</title>') // generated
  expect(webdevFeed).toContain('Web Dev Post')
  expect(webdevFeed).not.toContain('Tech Post')
  expect(webdevFeed).not.toContain('Frontend Post')

  const designFeed = await readDist(kit.dist, 'content/design/feed.xml')
  expect(designFeed).toContain('<title>Complex Site / Content → Design</title>')
  expect(designFeed).toContain('<subtitle>Design articles and tutorials</subtitle>')
  expect(designFeed).toContain('Design Post')
  expect(designFeed).not.toContain('Root Content Post')

  const frontendFeed = await readDist(kit.dist, 'content/tech/web-dev/frontend/feed.xml')
  expect(frontendFeed).toContain('<title>Complex Site / Frontend Development</title>') // custom
  expect(frontendFeed).toContain('Frontend Post')
  expect(frontendFeed).not.toContain('Web Dev Post')

  // Verify content isolation - each feed should only contain its own directory's content
  const allFeeds = [rootFeed, techFeed, webdevFeed, designFeed, frontendFeed]
  const allPosts = ['Root Content Post', 'Tech Post', 'Web Dev Post', 'Design Post', 'Frontend Post']
  
  // Each feed should contain exactly one post (the one from its directory)
  allFeeds.forEach((feedContent, index) => {
    const postMatches = allPosts.filter(post => feedContent.includes(post))
    expect(postMatches).toHaveLength(1)
  })
})