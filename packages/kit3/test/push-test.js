import { push, isBinary, chunk } from '../push'

// mock helpers
const mockFile = (type, content) => ({
  type,
  text: async () => content,
  arrayBuffer: async () => new ArrayBuffer(8)
})

const mockBunFile = (files) => {
  return (path) => files[path]
}

const mockFetch = () => {
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    return { ok: true }
  }
  return calls
}

// pure functions
test('isBinary', () => {
  expect(isBinary('image/jpeg')).toBe(true)
  expect(isBinary('image/png')).toBe(true)
  expect(isBinary('video/mp4')).toBe(true)
  expect(isBinary('font/woff2')).toBe(true)
  expect(isBinary('application/pdf')).toBe(true)
  expect(isBinary('application/zip')).toBe(true)
  
  expect(isBinary('text/html')).toBe(false)
  expect(isBinary('text/css')).toBe(false)
  expect(isBinary('application/json')).toBe(false)
})

test('chunk', () => {
  expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]])
  expect(chunk([1, 2, 3, 4], 1)).toEqual([[1], [2], [3], [4]])
  expect(chunk([], 2)).toEqual([])
})

// integration
test('push', async () => {
  const files = {
    'index.html': mockFile('text/html', '<h1>hello</h1>'),
    'style.css': mockFile('text/css', 'body { margin: 0 }'),
    'logo.png': mockFile('image/png', ''),
    'hero.jpg': mockFile('image/jpeg', ''),
    'script.js': mockFile('application/javascript', 'console.log("hi")')
  }
  
  const originalBunFile = Bun.file
  Bun.file = mockBunFile(files)
  
  const calls = mockFetch()
  const progress = []
  
  await push(Object.keys(files), 'test-token', (p) => {
    progress.push(p)
  })
  
  Bun.file = originalBunFile
  
  // verify progress tracking
  expect(progress.length).toBe(5)
  expect(progress[4]).toEqual({ completed: 5, total: 5, type: expect.any(String) })
  
  // verify text batching (3 text files)
  const textCalls = calls.filter(c => c.url == 'https://push.nuejs.com/text')
  expect(textCalls.length).toBeGreaterThan(0)
  expect(textCalls[0].options.headers.authorization).toBe('Bearer test-token')
  
  // verify binary individual posts (2 binary files)
  const binaryCalls = calls.filter(c => c.url == 'https://push.nuejs.com/binary')
  expect(binaryCalls.length).toBe(2)
  expect(binaryCalls[0].options.headers['content-type']).toMatch(/image/)
})