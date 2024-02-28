
import { compileFile as nueCompile} from 'nuejs-core'
import { join, basename } from 'node:path'
import { promises as fs } from 'node:fs'
import { resolve } from 'import-meta-resolve'
import { buildJS } from './builder.js'
import { colors } from './util.js'


export async function init({ dist, is_dev, esbuild }) {

  // directories
  const cwd = process.cwd()
  const srcdir = getSourceDir()
  const fromdir = join(srcdir, 'browser')
  const outdir = join(cwd, dist, '@nue')
  const minify = !is_dev


  // has all latest?
  const latest = join(outdir, '.043')
  try {
    return await fs.stat(latest)

  } catch {
    await fs.rm(outdir, { recursive: true, force: true })
    await fs.mkdir(outdir, { recursive: true })
    await fs.writeFile(latest, '')
  }

  // chdir hack (Bun does not support absWorkingDir)
  process.chdir(srcdir)

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

  process.chdir(cwd)
}


async function resolvePath(npm_path) {
  const [ npm_name, ...parts ] = npm_path.split('/')
  let main = await resolve(npm_name, `file://${process.cwd()}/`)
  main = main.replace(/^file:\/\//, '')
  main = process.platform === 'win32' && main.startsWith('/') ? main.slice(1) : main
  return main.replace('index.js', parts.join('/'))
}

function getSourceDir() {
  const path = new URL('.', import.meta.url).pathname
  return process.platform === "win32" && path.startsWith('/') ? path.slice(1) : path
}
