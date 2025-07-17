
import { writeFile, mkdir, rmdir, symlink } from 'node:fs/promises'
import { join } from 'node:path'

export const testDir = './test_dir'

export async function writeAll(items) {
  const paths = []

  for (const el of items) {
    if (Array.isArray(el)) {
      await write(el[0], el[1])
      paths.push(el[0])

    } else if (typeof el == 'object') {
      const [target, link] = Object.entries(el)[0]
      await symlink(target, join(testDir, link))
      paths.push(link)

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