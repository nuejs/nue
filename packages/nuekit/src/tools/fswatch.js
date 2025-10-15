
import { promises as fs, watch } from 'node:fs'
import { join, extname, sep } from 'node:path'
import { fswalk, matches } from './fswalk'

function toPosix(path) {
  return path.split(sep).join('/')
}

// Main fswatch function
export function fswatch(root, opts = {}) {
  const { ignore = ['.*', '_*', 'node_modules'] } = opts
  // const shouldProcess = createDeduplicator()

  // Start watching
  const watcher = watch(root, { recursive: true }, async function (event, raw_path) {
    const { onupdate, onremove } = watcher
    if (!raw_path) return
    const path = toPosix(raw_path)
    
    // Skip editor backup files
    if (isEditorBackup(path)) return

    // Skip if this is a duplicate event
    // if (!shouldProcess()) return

    // Check if path should be ignored
    if (matches(path, ignore)) return

    try {
      const fullPath = join(root, path)
      const stat = await fs.lstat(fullPath)

      // Process all files in the directory
      if (onupdate && stat.isDirectory()) {
        const paths = await fswalk(fullPath, ignore)

        for (const subPath of paths) {
          // Ensure the full path is also POSIX normalized
          await onupdate(toPosix(join(path, subPath)))
        }
      }

      if (onupdate && extname(path)) {
        await onupdate(path)
      }
    } catch (error) {
      if (error.errno == -2 && onremove) {
        await onremove(path)
      } else if (error.errno != -2) {
        console.error('fswatch error:', error)
      }
    }
  })

  return watcher
}

// Check if file is an editor backup/temp file
export function isEditorBackup(path) {
  return path.endsWith('~') || path.endsWith('.bck')
}

// Deduplicate rapid fire events
export function createDeduplicator() {
  let lastTime = 0
  return function shouldProcess() {
    const now = Date.now()
    if (now - lastTime < 50) return false
    lastTime = now
    return true
  }
}
