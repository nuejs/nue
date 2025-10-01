
import { matchPath } from '..'

const cases = [
  // Basic matching
  ['/', '/', true, {}],
  ['/users', '/users', true, {}],
  ['/users', '/posts', false],

  // Parameters
  ['/users/:id', '/users/123', true, { id: '123' }],
  ['/users/:id/posts/:postId', '/users/123/posts/456', true, { id: '123', postId: '456' }],
  ['/api/users/:id/profile', '/api/users/123/profile', true, { id: '123' }],

  // Length mismatches
  ['/users/:id', '/users/123/extra', false],

  // Global wildcard
  ['*', '/any/path/here', true, {}],

  // Path wildcards
  ['/admin/*', '/admin/users', true, {}],
  ['/admin/*', '/admin/users/123/profile', true, {}],
  ['/admin/*', '/public/users', false],
  ['/admin/*', '/admin', false],
  ['/users/:id/*', '/users/123/posts/456', true, { id: '123' }]
]

cases.forEach(([pattern, path, shouldMatch, expectedParams = {}]) => {
  const name = shouldMatch
    ? `${pattern} matches ${path}${Object.keys(expectedParams).length ? ` → ${JSON.stringify(expectedParams)}` : ''}`
    : `${pattern} rejects ${path}`

  test(name, () => {
    const result = matchPath(pattern, path)

    if (shouldMatch) {
      expect(result).toEqual({ match: true, params: expectedParams })
    } else {
      expect(result).toEqual({ match: false })
    }
  })
})