
import { writeFile, mkdir, rmdir } from 'node:fs/promises'
import { join } from 'node:path'

import { fswalk } from '../src/tools/fswalk'
import { createFile } from '../src/file'

export const testDir = './test_dir'

export async function writeAll(items) {
  const paths = []

  for (const el of items) {
    if (Array.isArray(el)) {
      await write(el[0], el[1])
      paths.push(el[0])

    } else {
      await write(el, '')
      paths.push(el)
    }
  }
  return paths
}

export async function write(path, content) {
  await mkdir(testDir, { recursive: true })
  if (typeof content == 'object') content = toYAML(content)

  // create subdir
  const i = path.lastIndexOf('/')
  if (i > 0) await await mkdir(join(testDir, path.slice(0, i)), { recursive: true })

  // write file
  await writeFile(join(testDir, path), content)
  return path
}

function toYAML(data) {
  const yaml = []
  Object.entries(data).forEach(([key, val]) => {
    yaml.push(`${key}: ${val}`)
  })
  return yaml.join('\n')
}

export async function removeAll() {
  try {
    await rmdir(testDir, { recursive: true, force: true })
  } catch (error) {}
}

// for debugging / testing
export async function fileset(dir) {
  const paths = await fswalk(dir)
  const files = await Promise.all(paths.map(path => createFile(dir, path)))

  files.read = async function(path) {
    const file = files.find(el => el.path == path)
    return await file?.text()
  }
  return files
}

