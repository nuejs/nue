import { writeFile, rm, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { createServer, TYPES } from '../src/nueserver.js'

const TEST_DIR = join(import.meta.dir, 'tmp-mime-types')
const PORT = 3403
const HOST = `http://localhost:${PORT}`

test('serves all MIME types with correct content-type', async () => {
  const server = createServer(TEST_DIR, (url) => {
    return { path: url.replace(/^\//, '') }
  })
  server.listen(PORT)

  try {
    // Setup: Create a temporary directory & a test file for each MIIME type
    const testFiles = []
    await mkdir(TEST_DIR, { recursive: true })

    for (const ext in TYPES) {
      const testExt = ext === 'default' ? 'unknown' : ext
      const filename = `test.${testExt}`
      const filePath = join(TEST_DIR, filename)
      
      const pngHeader = '\x89PNG\r\n'
      const content = ext.startsWith('image') ? pngHeader : 'nue'
      
      await writeFile(filePath, content)
      testFiles.push({ ext, filename, filePath })
    }

    // Test
    for (const { ext, filename } of testFiles) {
      const res = await fetch(`${HOST}/${filename}`)
      const contentType = res.headers.get('content-type')

      expect(res.status).toBe(200)
      expect(contentType).toBe(TYPES[ext])
    }
  } finally {
    // Teardown
    await rm(TEST_DIR, { recursive: true, force: true })
    server.close()
  }
})
