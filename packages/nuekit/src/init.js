import { promises as fs, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { compileFile as nueCompile } from 'nuejs-core'

import { buildJS } from './builder.js'
import { version, colors, srcdir } from './util.js'


export async function initNueDir({ dist, is_dev, esbuild, force }) {
  // directories
  const cwd = process.cwd()
  const outdir = join(cwd, dist, '@nue')

  // has all latest?
  const latest = join(outdir, `.v${version}`)

  if (force || !existsSync(latest)) {
    await fs.rm(outdir, { recursive: true, force: true })
    await fs.mkdir(outdir, { recursive: true })
    await fs.writeFile(latest, '')

    await initDir({ dist, is_dev, esbuild, cwd, srcdir, outdir })
  }
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
    const path = resolvePath(npm_path)
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
      path: resolvePath(npm_path),
    })
    dot()
  }

  // lets do it
  process.stdout.write(colors.green('✓') + ` Initialize ${dist}: `)

  // await buildPackage('nuemark/src/browser/nuemark.js', 'nuemark.js')
  await buildPackage('nuejs-core/src/browser/nue.js', 'nue.js')
  await buildFile('view-transitions')
  await buildFile('app-router')
  await buildFile('mount')

  // glow.css
  await copyAsset('nue-glow/minified/syntax.css', 'syntax.css')

  // dev only
  if (is_dev) {
    await buildPackage('diff-dom', 'diffdom.js')
    await buildFile('hotreload')
    await copy('error.css', outdir)
    await nueCompile(join(fromdir, 'error.dhtml'), join(outdir, 'error.js'))
  }

  // favicon
  await copy('favicon.ico', join(cwd, dist))

  // new line
  console.log()
}


function resolvePath(npm_path) {
  const [npm_name, ...parts] = npm_path.split('/')
  const module_path = dirname(fileURLToPath(import.meta.resolve(npm_name)))
  return join(module_path, ...parts)
}
