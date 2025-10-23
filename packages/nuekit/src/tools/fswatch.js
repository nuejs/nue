import { promises as fs, watch } from 'node:fs'
import { join, extname, sep } from 'node:path'
import { fswalk, matches } from './fswalk'

function toPosix(path) {
  return path.split(sep).join('/')
}

export function fswatch(root, opts = {}) {
  const { ignore = ['.*', '_*', 'node_modules'] } = opts
  const shouldProcess = createDeduplicator()

  const watcher = watch(root, { recursive: true }, async (event, raw) => {
    if (!raw) return

    const relPath = toPosix(raw)

    // 1) filter duplicates, backups and ignores
    if (!shouldProcess(relPath)) return
    if (isEditorBackup(relPath)) return
    if (matches(relPath, ignore)) return

    const fullPath = join(root, relPath)

    try {
      const stat = await fs.lstat(fullPath)

      // 2) if new dir, traverse and fire onupdate for each file
      if (stat.isDirectory()) {
        const entries = await fswalk(fullPath, ignore)
        for (const sub of entries) {
          const subRel = toPosix(join(relPath, sub))
          if (!shouldProcess(subRel)) continue
          if (isEditorBackup(subRel)) continue
          if (matches(subRel, ignore)) continue
          if (!extname(subRel)) continue
          watcher.onupdate?.(subRel)
        }
      } else {
        // 3) if file with extension
        if (extname(relPath)) {
          watcher.onupdate?.(relPath)
        }
      }
    } catch (err) {
      // 4) if no longer exists, remove
      if (err.code === 'ENOENT') {
        watcher.onremove?.(relPath)
      } else {
        console.error('fswatch error:', err)
      }
    }
  })

  return watcher
}

// Check if file is an editor backup/temp file
export function isEditorBackup(path) {
  return path.endsWith('~') || path.endsWith('.bck')
}

// Blocks duplicate events in a time window
export function createDeduplicator(debounceMs = 50) {
  let lastName = null
  let lastTime = 0
  return (name) => {
    const now = Date.now()
    if (name !== lastName || now - lastTime > debounceMs) {
      lastName = name
      lastTime = now
      return true
    }
    return false
  }
}
