
import { compileFile as nueCompile} from 'nuejs-core'
import { promises as fs } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolve } from 'import-meta-resolve'
import { buildJS } from './builder.js'
import { colors } from './util.js'


export async function init({ dist, is_dev, esbuild, force }) {

  // directories
  const cwd = process.cwd()
  const srcdir = fileURLToPath(dirname(import.meta.url))
  const outdir = join(cwd, dist, '@nue')

  // has all latest?
  const latest = join(outdir, '.043')
  try {
    if (force) doError()
    await fs.stat(latest)
    return false

  } catch {
    await fs.rm(outdir, { recursive: true, force: true })
    await fs.mkdir(outdir, { recursive: true })
    await fs.writeFile(latest, '')
  }

    await initDir({ dist, is_dev, esbuild, cwd, srcdir, outdir })
}

async function initDir({ dist, is_dev, esbuild, cwd, srcdir, outdir }) {

  const fromdir = join(srcdir, 'browser')
  const minify = !is_dev

  // simple function to wtite dot
  function dot() { process.stdout.write('•') }

  // copy from <fromdir>
  async function copy(base, todir) {
    await fs.copyFile(join(fromdir, base), join(todir, base))
    dot()
  }

  // copy from NPM path
  async function copyAsset(npm_path, toname) {
    const path = await resolvePath(npm_path)
    await fs.copyFile(path, join(outdir, toname))
    dot()
  }

  // build/minify single file
  async function buildFile(name) {
    await buildJS({ path: join(fromdir, `${name}.js`), outdir, esbuild, minify })
    dot()
  }

  // build package (from node_modules)
  async function buildPackage(npm_path, toname) {
    await buildJS({
      bundle: true, esbuild, minify, outdir, toname,
      path: await resolvePath(npm_path),
    })
    dot()
  }


  // lets do it
  process.stdout.write(colors.green('✓') + ` Initialize ${dist}: `)

  await buildPackage('nuemark/src/browser/nuemark.js', 'nuemark.js')
  await buildPackage('nuejs-core/src/browser/nue.js', 'nue.js')
  await buildFile('page-router')
  await buildFile('app-router')
  await buildFile('mount')

  // glow.css
  await copyAsset('nue-glow/minified/glow.css', 'glow.css')

  // dev only
  if (is_dev) {
    await buildPackage('diff-dom', 'diffdom.js')
    await buildFile('hotreload')
    await copy('error.css', outdir)
    await nueCompile(join(fromdir, 'error.nue'), join(outdir, 'error.js'))
  }

  // favicon
  await copy('favicon.ico', join(cwd, dist))

  // new line
  console.log('')
}


async function resolvePath(npm_path) {
  const [ npm_name, ...parts ] = npm_path.split('/')
  let main = resolve(npm_name, `file://${process.cwd()}/`)
  main = main.replace(/^file:\/\//, '')
  main = process.platform === 'win32' && main.startsWith('/') ? main.slice(1) : main
  return main.replace('index.js', parts.join('/'))
}
