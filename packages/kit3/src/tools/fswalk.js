
import { readdir, stat } from 'node:fs/promises'
import { parse, join, relative } from 'node:path'

const IGNORE = `node_modules .toml .rs .lock package.json .lockb lock.yaml README.md Makefile`.split(' ')

export function isIgnored(path) {
  return IGNORE.some(pattern => path.includes(pattern))
}

export function isSkipped(path) {
  const { base, dir } = parse(path)
  if ('._'.includes(base[0]) || '._'.includes(dir[0])) return true
}

function warn(message, path) {
  console.warn(`Warning: ${message} ${path}`)
}

async function walkDirectory(dir, root) {
  const results = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = relative(root, fullPath)

      if (isSkipped(relativePath) || isIgnored(relativePath)) continue

      try {
        if (entry.isDirectory()) {
          const subResults = await walkDirectory(fullPath, root)
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

export async function fswalk(root = '.') {
  try {
    await stat(root)
  } catch (error) {
    throw new Error(`Root directory does not exist: ${root}`)
  }

  return await walkDirectory(root, root)
}