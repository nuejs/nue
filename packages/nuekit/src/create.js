import { execSync } from 'node:child_process'
import { promises as fs, existsSync } from 'node:fs'
import { join } from 'node:path'

import { openUrl } from './util.js'
import { createKit } from './nuekit.js'

const gh = {
  base: 'https://api.github.com',
  contents(repo, dir) {
    return `${this.base}/repos/${repo}/contents/${dir}`
  },
  tarball(repo) {
    return `${this.base}/repos/${repo}/tarball`
  },
}

const remap = {
  'simple-blog': { open: 'welcome/' },
}


async function serve(args) {
  const tmpl = remap[args.name] || {}
  if (tmpl.root) args.root = join(args.root, tmpl.root)

  const nue = await createKit(args)
  const terminate = await nue.serve()

  // open welcome page
  if (!args.debug) openUrl(`http://localhost:${nue.port}/${tmpl.open || ''}`)
  return terminate
}

export async function create(args = {}) {
  if (!args.name) args.name = args.paths.shift().split('/').filter(Boolean).join('/') || 'simple-blog'
  if (!args.root) args.root = args.paths.shift() || args.name.replaceAll('/', '-')

  // debug mode with: `nue create test`
  args.debug = args.name == 'test'
  if (args.debug) args.name = 'simple-blog'

  const { debug, name, root } = args
  const is_gh = name.split('/').length == 2

  // check if template exists
  const templates = is_gh ? [] : // no templates check if is_gh
    (await (await fetch(gh.contents('nuejs/nue', 'packages/examples'))).json()).filter(el => el.type == 'dir').map(el => el.name)

  if (!is_gh && !templates.includes(name)) {
    console.error(`Template "${name}" does not exist!`)
    console.error('Available templates:')
    for (const t of templates) console.error(' -', t)
    return
  }

  if (existsSync(root)) {
    // read files
    const files = (await fs.readdir(root)).filter(f => !f.startsWith('.'))

    // already created -> serve
    if (files.includes('site.yaml')) return serve(args)

    // must be empty directory
    if (files.length) return console.error('Please create the template to an empty directory')

  } else await fs.mkdir(root, { recursive: true })

  // download archive
  console.info('Loading template...')
  const archive_name = join(root, 'source.tar.gz')
  const archive_web = is_gh ? gh.tarball(name) : `https://${name}.nuejs.org/${debug ? 'test' : 'source'}.tar.gz`
  const archive = await fetch(archive_web)

  // catch download issues
  if (archive.status != 200) return console.error(`Downloading template "${archive_web}" failed with "${archive.statusText}".`)
  await fs.writeFile(archive_name, Buffer.from(await archive.arrayBuffer()))

  // uncompress
  execSync(`tar -C ${root} --strip-components 1 -xf ${archive_name}`)

  // remove archive
  await fs.rm(archive_name)

  // serve
  console.info(`Created template "${name}" to "${root}".`)
  if (!is_gh) return await serve(args)
  else console.warn('Not launching public GitHub project.\nPlease verify the contents before running the project.')
}
