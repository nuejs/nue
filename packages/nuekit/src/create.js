import { execSync } from 'node:child_process'
import { promises as fs } from 'node:fs'

import { openUrl } from './util.js'
import { createKit } from './nuekit.js'

async function serve(root) {
  const nue = await createKit({ root })
  const terminate = await nue.serve()

  // open welcome page
  try {
    execSync(`${openUrl} http://localhost:${nue.port}/welcome/`)
  } catch {}
  return terminate
}

export async function create({ root = '.', name = 'simple-blog' }) {

  // read files
  const files = (await fs.readdir(root)).filter(f => !f.startsWith('.'))

  // already created -> serve
  if (files.includes('site.yaml')) return serve(root)

  // currently only simple-blog is available
  if (name != 'simple-blog') return console.error('Template does not exist:', name)

  // must be empty directory
  if (files.length) return console.error('Please create the template to an empty directory')

  // download archive
  const archive_name = 'source.tar.gz'
  const archive = await fetch(`https://${name}.nuejs.org/${name}.tar.gz`)
  await fs.writeFile(archive_name, await archive.arrayBuffer())

  // unzip and remove archive
  execSync(`tar -xf ${archive_name} -C ${root}`)
  await fs.rm(archive_name)

  // serve
  return await serve(root)
}
