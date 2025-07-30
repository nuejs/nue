
import { testDir, writeAll, removeAll } from './test-utils'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fswalk } from '../src/fswalk'


beforeEach(async () => {
  await writeAll([
    ['file1.txt', 'content1'],
    ['file2.js', 'console.log("hello")'],
    ['.hidden', 'hidden content'],
    ['nested/nested-file.md', '# Nested'],
    ['node_modules/package.json', '{}'],
    ['real-dir/real-file.txt', 'real content'],
    { 'file1.txt': 'symlink-file' },
    { 'real-dir': 'symlink-dir' },
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

test('includes dotfiles by default', async () => {
  const paths = await fswalk(testDir)
  expect(paths).toContain('.hidden')
})

test('ignores patterns from ignore array', async () => {
  const paths = await fswalk(testDir, { ignore: ['node_modules/**'] })
  const hasNodeModules = paths.some(path => path.includes('node_modules'))
  expect(hasNodeModules).toBe(false)
})

test('ignores dotfiles when specified', async () => {
  const paths = await fswalk(testDir, { ignore: ['.*'] })
  expect(paths).not.toContain('.hidden')
})

test('follows symlinks', async () => {
  const paths = await fswalk(testDir, { followSymlinks: true })
  expect(paths).toContain('symlink-file')
  expect(paths).toContain('symlink-dir/real-file.txt')
})

test('skips symlinks when followSymlinks is false', async () => {
  const paths = await fswalk(testDir, { followSymlinks: false })
  expect(paths).not.toContain('symlink-file')
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
  const paths = await fswalk(testDir, { ignore: ['*.js', 'node_modules/**'] })

  expect(paths).not.toContain('file2.js')
  const hasNodeModules = paths.some(path => path.includes('node_modules'))
  expect(hasNodeModules).toBe(false)
})

test('uses current directory as default root', async () => {
  const paths = await fswalk()
  expect(Array.isArray(paths)).toBe(true)
})

test('combines ignore and followSymlinks options', async () => {
  const paths = await fswalk(testDir, {
    ignore: ['*.js'],
  })

  expect(paths).not.toContain('file2.js')
  expect(paths).not.toContain('symlink-file')
  expect(paths).toContain('file1.txt')
})

test('broken symlinks gracefully', async () => {
  await writeAll([{ './non-existent-file': 'broken-symlink' }])
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

  const paths = await fswalk(testDir, { followSymlinks: true })
  expect(paths).not.toContain('broken-symlink')
  expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Warning: Broken symlink'))

  consoleSpy.mockRestore()
})

test('works with empty options object', async () => {
  const paths = await fswalk(testDir, {})
  expect(Array.isArray(paths)).toBe(true)
  expect(paths.length).toBeGreaterThan(0)
})

test('works with partial options', async () => {
  const pathsIgnore = await fswalk(testDir, { ignore: ['*.js'], followSymlinks: true })
  expect(pathsIgnore).not.toContain('file2.js')
  expect(pathsIgnore).toContain('symlink-file') // followSymlinks defaults to true

  const pathsNoSymlinks = await fswalk(testDir, { followSymlinks: false })
  expect(pathsNoSymlinks).toContain('file2.js') // ignore defaults to []
  expect(pathsNoSymlinks).not.toContain('symlink-file')
})

test('respects glob patterns in ignore', async () => {
  await writeAll([
    ['src/components/Button.jsx', 'export default Button'],
    ['src/index.js', 'main file'],
  ])

  const paths = await fswalk(testDir, { ignore: ['src/components/**'] })
  expect(paths).toContain('src/index.js')
  expect(paths).not.toContain('src/components/Button.jsx')
})

test('handles nested symlink directories', async () => {
  await writeAll([
    ['deep/nested/file.txt', 'deep content'],
    { 'deep': 'symlink-to-deep' },
  ])

  const paths = await fswalk(testDir, { followSymlinks: true })
  expect(paths).toContain('symlink-to-deep/nested/file.txt')

  const pathsNoSymlinks = await fswalk(testDir, { followSymlinks: false })
  expect(pathsNoSymlinks).not.toContain('symlink-to-deep/nested/file.txt')
  expect(pathsNoSymlinks).toContain('deep/nested/file.txt')
})

