
import { readdir, stat } from 'node:fs/promises'
import { parse, join, relative, sep } from 'node:path'

// Normalize path separators to POSIX format (forward slashes)
function toPosix(path) {
  return path.split(sep).join('/')
}

export function matches(path, patterns) {
  return patterns.some(pattern => path.includes(pattern))
}

export function isSkipped(path) {
  const { base, dir } = parse(path)
  if ('._'.includes(base[0]) || '._'.includes(dir[0])) return true
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
      let relativePath = relative(root, fullPath)
      // Normalize to POSIX path separators
      relativePath = toPosix(relativePath)

      if (isSkipped(relativePath) || matches(relativePath, ignore)) continue

      try {
        if (entry.isDirectory()) {
          const subResults = await walkDirectory(fullPath, root, opts)
          results.push(...subResults)

        } else if (entry.isFile()) {
          results.push(relativePath)
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