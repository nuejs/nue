import { execSync } from 'node:child_process'
import { promises as fs } from 'node:fs'

import { createKit } from './nuekit.js'

async function serve() {
  const nue = await createKit({ root: '.' })
  const terminate = await nue.serve()

  // open welcome page
  const open = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open'
  try {
    execSync(`${open} http://localhost:${nue.port}/welcome/`)
  } catch {}
  return terminate
}

export async function create({ name = 'simple-blog' }) {

  // read files
  const files = (await fs.readdir('.')).filter(f => !f.startsWith('.'))

  // already created -> serve
  if (files.includes('site.yaml')) return serve()

  // currently only simple-blog is available
  if (name != 'simple-blog') return console.error('Template does not exist:', name)

  // must be empty directory
  if (files.length) return console.error('Please create the template to an empty directory')

  // download archive
  const archive_name = 'source.tar.gz'
  const archive = await fetch(`https://${name}.nuejs.org/${name}.tar.gz`)
  await fs.writeFile(archive_name, await archive.arrayBuffer())

  // unzip and remove archive
  execSync(`tar -xf ${archive_name}`)
  await fs.rm(archive_name)

  // serve
  return await serve()
}
