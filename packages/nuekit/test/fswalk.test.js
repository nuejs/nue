
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { testDir, writeAll, removeAll } from './test-utils'
import { fswalk } from '../src/tools/fswalk'


beforeEach(async () => {
  await writeAll([
    ['file1.txt', 'content1'],
    ['file2.js', 'console.log("hello")'],
    ['.hidden', 'hidden content'],
    ['nested/nested-file.md', '# Nested'],
    ['node_modules/package.json', '{}'],
    ['real-dir/real-file.txt', 'real content']
  ])
})

afterEach(async () => { await removeAll() })


test('returns array of file paths', async () => {
  const paths = await fswalk(testDir)

  expect(Array.isArray(paths)).toBe(true)
  expect(paths.length).toBeGreaterThan(0)
  expect(paths).toContain('file1.txt')
  expect(paths).toContain('file2.js')
  expect(paths).toContain('nested/nested-file.md')
})

test('ignores dotfiles', async () => {
  const paths = await fswalk(testDir)
  expect(paths).not.toContain('.hidden')
})

test('ignores patterns from ignore array', async () => {
  const paths = await fswalk(testDir, { ignore: ['node_modules'] })
  const hasNodeModules = paths.some(path => path.includes('node_modules'))
  expect(hasNodeModules).toBe(false)
})

test('throws error when root does not exist', async () => {
  await expect(fswalk('./non-existent-directory')).rejects.toThrow('Root directory does not exist')
})

test('returns empty array for empty directory', async () => {
  const emptyDir = join(testDir, 'empty')
  await mkdir(emptyDir)
  const paths = await fswalk(emptyDir)
  expect(paths).toEqual([])
})

test('multiple ignore patterns', async () => {
  const paths = await fswalk(testDir, { ignore: ['.js', 'node_modules'] })

  expect(paths).not.toContain('file2.js')
  const hasNodeModules = paths.some(path => path.includes('node_modules'))
  expect(hasNodeModules).toBe(false)
})

test('uses current directory as default root', async () => {
  const paths = await fswalk()
  expect(Array.isArray(paths)).toBe(true)
})

test('works with empty options object', async () => {
  const paths = await fswalk(testDir, {})
  expect(Array.isArray(paths)).toBe(true)
  expect(paths.length).toBeGreaterThan(0)
})

test('respects glob patterns in ignore', async () => {
  await writeAll([
    ['src/components/Button.jsx', 'export default Button'],
    ['src/index.js', 'main file'],
  ])

  const paths = await fswalk(testDir, { ignore: ['src/components'] })
  expect(paths).toContain('src/index.js')
  expect(paths).not.toContain('src/components/Button.jsx')
})

