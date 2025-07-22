
import { readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

export function matches(path, patterns) {
  return patterns.some(pattern => {
    const glob = new Bun.Glob(pattern)
    return glob.match(path)
  })
}

function warn(message, path) {
  console.warn(`Warning: ${message} ${path}`)
}

async function walkDirectory(dir, root, opts) {
  const { ignore = [], followSymlinks } = opts
  const results = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = relative(root, fullPath)

      if (matches(relativePath, ignore)) continue

      try {
        if (entry.isDirectory()) {
          const subResults = await walkDirectory(fullPath, root, opts)
          results.push(...subResults)

        } else if (entry.isFile()) {
          results.push(relativePath)

        } else if (entry.isSymbolicLink() && followSymlinks) {
          try {
            const stats = await stat(fullPath)
            if (stats.isDirectory()) {
              const subResults = await walkDirectory(fullPath, root, opts)
              results.push(...subResults)
            } else if (stats.isFile()) {
              results.push(relativePath)
            }

          } catch (symlinkError) {
            if (symlinkError.code == 'ENOENT') {
              warn('Broken symlink', relativePath)
            } else {
              warn('Error following symlink', relativePath)
            }
          }
        }
      } catch (error) {
        if (error.code == 'ENOENT') {
          warn('Broken symlink', relativePath)
        } else if (error.code == 'EACCES') {
          warn('Permission denied', relativePath)
        } else {
          warn('Error accessing', relativePath)
        }
      }
    }
  } catch (error) {
    warn('Permission denied reading directory', dir)
  }

  return results
}

export async function fswalk(root = '.', opts = {}) {
  try {
    await stat(root)
  } catch (error) {
    throw new Error(`Root directory does not exist: ${root}`)
  }

  return await walkDirectory(root, root, opts)
}