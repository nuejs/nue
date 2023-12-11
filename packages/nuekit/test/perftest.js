
/*
  Test performance by creating a site with N pages (default 50)
  with a content_collection to referencing all the pages, and with
  a layout.html that loops top 10 pages
*/

import { createKit } from '../src/nuekit.js'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'

const root = 'perf'

async function clean() {
  await fs.rm(root, { recursive: true, force: true })
}

async function gen(count, name, content) {
  for (let i = 0; i < count; i++) {
    await fs.writeFile(join(root, name.replace('#', i+1)), content)
  }
}

const SITE = `
inline_css: true
content_collection: .
collection_name: pages
`

const LAYOUT = `
<main>
  <div :for="page in pages.slice(0, 10)">{ page.url }</div>
</main>
`

async function genall() {
  await fs.mkdir(root, { recursive: true })
  await gen(1, 'site.yaml', SITE)
  await gen(1, 'layout.html', LAYOUT)
  await gen(3, 'style-#.css', `body { margin: 0 }`)
  await gen(50, 'page-#.md', `# Hello, World`)
}

async function build() {
  console.time()
  const kit = await createKit({ root, verbose: true, use_cache: true })
  await kit.build()
  console.timeEnd()
}

await genall()
await build()
await clean()