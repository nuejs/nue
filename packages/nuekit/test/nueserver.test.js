import { promises as fs } from 'node:fs'
import { join } from 'node:path'

import { createServer, TYPES } from '../src/nueserver.js'


// temporary directory
const root = '_test'
const PORT = 3403
const HOST = `http://localhost:${PORT}`
const testFiles = []


// setup and teardown
beforeAll(async () => {
  await fs.rm(root, { recursive: true, force: true })
  await fs.mkdir(root, { recursive: true })

  // Setup: Create a temporary directory & a test file for each MIME type
  for (const ext in TYPES) {
    const filename = `test.${ext == 'default' ? 'unknown' : ext}`
    const filePath = join(root, filename)

    await fs.writeFile(filePath, '')
    testFiles.push({ ext, filename, filePath })
  }
})

afterAll(async () => {
  await fs.rm(root, { recursive: true, force: true })
})


test('serve all file extensions with correct MIME type', async () => {
  const server = createServer(root, (path) => ({ path }))
  server.listen(PORT)

  try {
    for (const { ext, filename } of testFiles) {
      const res = await fetch(`${HOST}/${filename}`)
      const contentType = res.headers.get('content-type')

      expect(res.status).toBe(200)
      expect(contentType).toBe(TYPES[ext])
    }
  } finally { server.close() }
})
