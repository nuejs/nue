import { test, expect } from 'bun:test'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'

import {
  createDeduplicator,
  isEditorBackup,
  fswatch,
} from '../src/tools/fswatch.js'

// Helper function to wait for expected array length
async function waitForEvents(array, expectedCount, maxWait = 1000) {
  const start = Date.now()
  while (array.length < expectedCount && Date.now() - start < maxWait) {
    await new Promise(resolve => setTimeout(resolve, 5))
  }
}

test('identify backup files', () => {
  expect(isEditorBackup('file.txt~')).toBe(true)
  expect(isEditorBackup('script.js~')).toBe(true)
  expect(isEditorBackup('file.txt_123456.bck')).toBe(true)
  expect(isEditorBackup('regular.css')).toBe(false)
})

test.skip('deduplicator blocks rapid events', async () => {
  const shouldProcess = createDeduplicator()

  expect(shouldProcess()).toBe(true)
  expect(shouldProcess()).toBe(false)

  // Wait longer than debounce period
  await new Promise(resolve => setTimeout(resolve, 60))
  expect(shouldProcess()).toBe(true)
})

test('watches single file changes', async () => {
  const tmpDir = await fs.mkdtemp('/tmp/fswatch-test-')
  const testFile = join(tmpDir, 'test.txt')

  const changes = []
  const watcher = fswatch(tmpDir)
  watcher.onupdate = async path => changes.push(path)

  // Create a file
  await fs.writeFile(testFile, 'hello')

  // Wait for event
  await waitForEvents(changes, 1)

  expect(changes).toContain('test.txt')

  watcher.close()
  await fs.rm(tmpDir, { recursive: true })
})

test('watches directory creation and processes files', async () => {
  const tmpDir = await fs.mkdtemp('/tmp/fswatch-test-')
  const newDir = join(tmpDir, 'newdir')

  const changes = []
  const watcher = fswatch(tmpDir)
  watcher.onupdate = async path => changes.push(path)

  // Create directory with files
  await fs.mkdir(newDir)
  await fs.writeFile(join(newDir, 'file1.txt'), 'content1')
  await fs.writeFile(join(newDir, 'file2.js'), 'content2')

  // Wait for events
  await waitForEvents(changes, 2)

  expect(changes).toContain('newdir/file1.txt')
  expect(changes).toContain('newdir/file2.js')

  watcher.close()
  await fs.rm(tmpDir, { recursive: true })
})

test('ignores files matching patterns', async () => {
  const tmpDir = await fs.mkdtemp('/tmp/fswatch-test-')

  const changes = []
  const watcher = fswatch(tmpDir, { ignore: ['*.log', '.hidden*'] })
  watcher.onupdate = async path => changes.push(path)

  // Create files
  await fs.writeFile(join(tmpDir, 'good.txt'), 'content')
  await fs.writeFile(join(tmpDir, 'debug.log'), 'logs')
  await fs.writeFile(join(tmpDir, '.hidden'), 'secret')

  // Wait for the one file we expect
  await waitForEvents(changes, 1)

  expect(changes).toContain("good.txt")
  expect(changes).not.toContain('.hidden')

  watcher.close()
  await fs.rm(tmpDir, { recursive: true })
})

test('handles file removal', async () => {
  const tmpDir = await fs.mkdtemp('/tmp/fswatch-test-')
  const testFile = join(tmpDir, 'test.txt')

  const removed = []
  const watcher = fswatch(tmpDir)
  watcher.onremove = async path => removed.push(path)

  // Create then remove file
  await fs.writeFile(testFile, 'content')
  await new Promise(resolve => setTimeout(resolve, 50)) // Let creation settle
  await fs.unlink(testFile)

  // Wait for removal event
  await waitForEvents(removed, 1)

  expect(removed).toContain('test.txt')

  watcher.close()
  await fs.rm(tmpDir, { recursive: true })
})

test('ignores files without extensions', async () => {
  const tmpDir = await fs.mkdtemp('/tmp/fswatch-test-')

  const changes = []
  const watcher = fswatch(tmpDir)
  watcher.onupdate = async path => changes.push(path)

  // Create files with and without extensions
  await fs.writeFile(join(tmpDir, 'withext.txt'), 'content')
  await fs.writeFile(join(tmpDir, 'noext'), 'content')

  // Wait for the one file we expect
  await waitForEvents(changes, 1)

  expect(changes).toContain('withext.txt')
  expect(changes).not.toContain('noext')

  watcher.close()
  await fs.rm(tmpDir, { recursive: true })
})