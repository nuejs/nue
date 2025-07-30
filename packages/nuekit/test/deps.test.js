
import { applyUsePatterns, listDependencies, filterByLib } from '../src/deps'

describe('lib[] filtering', () => {

  const paths = [
    '@system/design/button.css',
    '@system/components/nav.html',
    'blog/view/layout.html',
    'blog/components/header.html',
    'home/view/index.html',
    'docs/components/sidebar.js',
    'random/file.css',
    'blog/nested/components/footer.html'
  ]

  test('@system paths', () => {
    expect(filterByLib('blog/post.md', ['@system'], paths)).toEqual([
      '@system/design/button.css',
      '@system/components/nav.html'
    ])
  })

  test('relative paths', () => {
    expect(filterByLib('blog/post.md', ['./view'], paths)).toEqual([
      'blog/view/layout.html'
    ])
  })

  test('multiple libs', () => {
    expect(filterByLib('blog/post.md', ['@system', './view'], paths)).toEqual([
      '@system/design/button.css',
      '@system/components/nav.html',
      'blog/view/layout.html'
    ])
  })

  test('relative paths from different contexts', () => {
    expect(filterByLib('docs/article.md', ['./components'], paths)).toEqual([
      'docs/components/sidebar.js'
    ])
  })

  test('root level context', () => {
    expect(filterByLib('index.md', ['./home/view'], paths)).toEqual([
      'home/view/index.html'
    ])
  })

  test('returns empty array when no matches', () => {
    expect(filterByLib('blog/post.md', ['./missing'], paths)).toEqual([])
  })


  test('filters all libs together', () => {
    expect(filterByLib('blog/post.md', ['@system', './view', './components'], paths)).toEqual([
      '@system/design/button.css',
      '@system/components/nav.html',
      'blog/view/layout.html',
      'blog/components/header.html'
    ])
  })
})

describe('use[] filtering', () => {
  const paths = [
    '@system/design/button.css',
    '@system/design/core.css',
    '@system/modules/syntax.css',
    '@system/modules/form.css',

    '@system/components/nav.html',

    'blog/view/layout.html',
    'blog/view/article.html',
    'blog/components/header.html',
    'blog/components/form.js'
  ]

  test('exact file pattern', () => {
    expect(applyUsePatterns('blog/post.md', { use: ['syntax.css'], paths })).toEqual([
      '@system/modules/syntax.css'
    ])
  })

  test('partial file pattern', () => {
    expect(applyUsePatterns('index.md', { use: ['syntax'], paths })).toEqual([
      '@system/modules/syntax.css'
    ])
  })

  test('wildcard patterns', () => {
    expect(applyUsePatterns('about.md', { use: ['design/*.css'], paths })).toEqual([
      '@system/design/button.css',
      '@system/design/core.css'
    ])
  })

  test('relative patterns', () => {
    expect(applyUsePatterns('blog/post.md', { use: ['./view/*'], paths })).toEqual([
      'blog/view/layout.html',
      'blog/view/article.html'
    ])
  })

  test('exclusion patterns', () => {
    expect(applyUsePatterns('blog/post.md', { use: ['design/*.css', '!syntax.c*s'], paths })).toEqual([
      '@system/design/button.css',
      '@system/design/core.css'
    ])
  })

  test('patterns in order with overrides', () => {
    const use = [ 'design/*.css', 'syntax.css', '!button' ]

    expect(applyUsePatterns('blog/post.md', { use, paths })).toEqual([
      '@system/design/core.css',
      '@system/modules/syntax.css'
    ])
  })

  test('removes duplicates', () => {
    expect(applyUsePatterns('blog/post.md', { use: ['core.css', 'design/core.css', 'core' ], paths })).toEqual([
      '@system/design/core.css'
    ])
  })

  test('returns empty array for no matches', () => {
    expect(applyUsePatterns('blog/post.md', { use: ['missing/*.css'], paths })).toEqual([])
  })

  test('root level relative patterns', () => {
    expect(applyUsePatterns('index.md', { use: ['./home/view/*'], paths })).toEqual([])
  })

  test('relative exclusions', () => {
    expect(applyUsePatterns('blog/post.md', { use: ['form', '!form.css'], paths })).toEqual([
      'blog/components/form.js',
    ])
  })

  test('custom lib', () => {
    expect(applyUsePatterns('blog/post.md', { use: ['design/*.css'], paths, lib: [] })).toEqual([])
  })

  test('handles patterns with relative lib context', () => {
    const paths = [
      '@system/design/button.css',
      'blog/view/layout.html',
      'blog/view/article.html',
      'blog/components/header.html'
    ]

    // This should work - pattern should resolve through the relative lib paths
    const result = applyUsePatterns('blog/post.md', { use: ['./view/*.html'], paths })

    expect(result).toEqual([
      'blog/view/layout.html',
      'blog/view/article.html'
    ])
  })

  test('main function: listDependencies', () => {
    const arr = listDependencies('blog/entry.js', { use: ['syntax'], paths })
    expect(arr).toEqual([ '@system/modules/syntax.css' ])
  })

})


describe('dir level paths', () => {

  test('dir paths', () => {
    const paths = [
      '@system/design/button.css',
      'blog/post.md',
      'blog/header.html',
      'blog/utils.js',
      'blog/types.ts',
      'blog/local.css',
      'docs/sidebar.html'
    ]

    const result = listDependencies('blog/header.html', {
      paths,
      lib: ['@system', './blog'],
      use: [],
      use_local_css: true
    })

    // self included
    expect(result).toContain('blog/header.html')
    expect(result).toContain('blog/utils.js')
    expect(result).toContain('blog/types.ts')
    expect(result).toContain('blog/local.css')
    expect(result).not.toContain('docs/sidebar.html')
  })

  test('excludes directory CSS when use_local_css is false', () => {
    const paths = [
      '@system/design/button.css',
      'blog/post.md',
      'blog/header.html',
      'blog/utils.js',
      'blog/local.css'
    ]

    const result = listDependencies('blog/post.md', {
      paths,
      lib: ['@system', './'],
      use: [],
      use_local_css: false
    })

    expect(result).toContain('blog/header.html')
    expect(result).toContain('blog/utils.js')
    expect(result).not.toContain('blog/local.css')
  })

  test('handles root level directory paths', () => {
    const paths = [
      'index.md',
      'layout.html',
      'app.js',
      'global.css'
    ]

    const result = listDependencies('index.md', {
      paths,
      lib: ['./'],
      use: [],
      use_local_css: true
    })

    expect(result).toContain('layout.html')
    expect(result).toContain('app.js')
    expect(result).toContain('global.css')
  })

  test('combines directory paths with use patterns', () => {
    const paths = [
      '@system/design/button.css',
      'blog/post.md',
      'blog/header.html',
      'blog/utils.js'
    ]

    const result = listDependencies('blog/post.md', {
      paths,
      lib: ['@system', './'],
      use: ['@system/design/button.css'],
      use_local_css: false
    })

    expect(result).toContain('blog/header.html')  // directory file
    expect(result).toContain('blog/utils.js')     // directory file
    expect(result).toContain('@system/design/button.css')  // use pattern
  })

})