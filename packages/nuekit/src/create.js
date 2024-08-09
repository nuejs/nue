
import { createKit } from './nuekit.js'
import { finished } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'
import { execSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { Readable } from 'node:stream'


async function serve() {
  const nue = await createKit({ root: '.' })
  await nue.serve()

  // open welcome page
  execSync('open http://localhost:8083/welcome/')
}

export async function create({ name='simple-blog' }) {

  // read files
  const files = await fs.readdir('.')

  // already created -> serve
  if (files.includes('site.yaml')) return serve()

  // currently only simple-blog is available
  if (name != 'simple-blog') return console.error('Template does not exist', name)

  // must be empty directory
  if (files[1] || files[0] != '.DS_Store') {
    return console.error('Please create the appplication to an empty directory')
  }

  // download zip
  const zip = await fetch(`https://${ name }.nuejs.org/${name}.zip`)
  await Bun.write('source.zip', zip)

  // unzip
  await execSync('unzip source.zip')

  // serve
  await serve()
}