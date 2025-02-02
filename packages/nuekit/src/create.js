import { execSync } from 'node:child_process'
import { promises as fs, existsSync } from 'node:fs'
import { join } from 'node:path'

import { openUrl } from './util.js'
import { createKit } from './nuekit.js'


async function serve(root, port, debug) {
  const nue = await createKit({ root, port })
  const terminate = await nue.serve()

  // open welcome page
  if (!debug) execSync(`${openUrl} http://localhost:${nue.port}/welcome/`)
  return terminate
}

export async function create({ root, name = 'simple-blog', port }) {
  if (!root) root = name

  // debug mode with: `nue create test`
  const debug = name == 'test'
  if (debug) name = 'simple-blog'

  // currently only simple-blog is available
  if (name != 'simple-blog') return console.error(`Template "${name}" does not exist`)

  if (existsSync(root)) {
    // read files
    const files = (await fs.readdir(root)).filter(f => !f.startsWith('.'))

    // already created -> serve
    if (files.includes('site.yaml')) return serve(root)

    // must be empty directory
    if (files.length) return console.error('Please create the template to an empty directory')

  } else await fs.mkdir(root, { recursive: true })

  // download archive
  console.info('Loading template...')
  const archive_name = join(root, `${name}-source.tar.gz`)
  const archive_web = `https://${name}.nuejs.org/${debug ? 'test' : 'source'}.tar.gz`
  const archive = await fetch(archive_web)

  // catch download issues
  if (archive.status != 200) return console.error(`Downloading template "${archive_web}" failed with "${archive.statusText}".`)
  await fs.writeFile(archive_name, Buffer.from(await archive.arrayBuffer()))

  // uncompress
  execSync(`tar -C ${root} --strip-components 1 -xf ${archive_name}`)

  // remove archive
  await fs.rm(archive_name)

  // serve
  return await serve(root, port, debug)
}
