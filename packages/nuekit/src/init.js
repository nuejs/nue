
import { compileFile as nueCompile} from 'nuejs-core/index.js'
import { join, basename } from 'node:path'
import { promises as fs } from 'node:fs'
import { log, colors } from './util.js'
import { buildJS } from './builder.js'


export async function init({ dist, is_dev, esbuild }) {

  // directories
  const cwd = process.cwd()
  const srcdir = new URL('.', import.meta.url).pathname
  const fromdir = join(srcdir, 'browser')
  const outdir = join(cwd, dist, '@nue')
  const minify = !is_dev


  // has all latest?
  const latest = join(outdir, '.016')
  try {
    return await fs.stat(latest)

  } catch {
    await fs.rmdir(outdir, { recursive: true })
    await fs.mkdir(outdir, { recursive: true })
    await fs.writeFile(latest, '')
  }

  // chdir hack (Bun does not support absWorkingDir)
  process.chdir(srcdir)


  function print(name) {
    console.log('  ', colors.gray(name))
  }

  // file copy
  async function copy(base, todir) {
    await fs.copyFile(join(fromdir, base), join(todir, base))
    print(base)
  }

  // build/minify single file
  async function buildFile(name) {
    await buildJS({ path: join(fromdir, `${name}.js`), outdir, esbuild, minify })
    print(`${name}.js`)
  }

  // build package (from node_modules)
  async function buildPackage(name, toname) {
    await buildJS({
      path: name,
      bundle: true,
      esbuild,
      minify,
      outdir,
      toname
    })
    print(toname)
  }


  // lets do it
  log(`Initialize ${dist}`)

  await buildPackage('nuejs-core', 'nue.js')
  await buildPackage('diff-dom', 'diffdom.js')

  await buildFile('page-router')
  await buildFile('app-router')
  await buildFile('mount')

  // dev only
  if (is_dev) {
    await buildFile('hotreload')
    await copy('error.css', outdir)
    await nueCompile(join(fromdir, 'error.nue'), join(outdir, 'error.js'))
  }

  // favicon
  await copy('favicon.ico', join(cwd, dist))

  process.chdir(cwd)
}
