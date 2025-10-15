import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export const NAMES = 'blog full minimal spa'.split(' ')

export async function create(name, { dir, baseurl }) {
  if (!name) return console.log('❌ USAGE: nue create <template-name>')

  if (!NAMES.includes(name)) {
    return console.log('❌ Choose one: ' + NAMES.join(', '))
  }

  if (await Bun.file(name).exists()) {
    return console.log(`✨ ${name} directory already exists`)
  }

  try {
    // load zip from local or remote
    const zip = dir ? await getLocalZip(name, dir) : await fetchZip(name, baseurl)
    await unzip(name, zip)

    // success message
    console.log(`\n🎉  "${name}" directory created. Your next steps:`)
    console.log(`   cd ${name}`)
    console.log(`   nue\n`)

    return true
  } catch (error) {
    console.error(`❌ ${error.message}`)
  }
}

export async function getLocalZip(name, dir) {
  const path = join(dir, `${name}.zip`)
  if (!(await Bun.file(path).exists())) throw new Error(`${path} not found`)
  console.log(`📦 Using local template: ${path}`)
  return Bun.file(path)
}

// download from github
//
export async function fetchZip(
  name,
  baseurl = 'https://github.com/nuejs/nue/raw/master/packages/templates'
) {
  const url = `${baseurl}/${name}.zip`
  const resp = await fetch(url)
  if (resp.status != 200) throw new Error(`${url} not found`)
  console.log(`📦 Downloading ${name} template...`)
  return resp
}

// unzip.js
export async function unzip(dir, zip) {
  const filename = `${dir}.zip`

  try {
    // write zip file
    await Bun.write(filename, zip)

    // extract (expects "minimal" directory inside zip)
    const cmd = process.platform == 'win32' ? ['tar', '-xf', filename] : ['unzip', '-q', filename]
    const proc = Bun.spawn(cmd)
    const exitCode = await proc.exited

    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text()
      throw new Error(`Unpacking archive failed with exit code ${exitCode}: ${stderr}`)
    }

    // clean up
  } finally {
    try {
      await Bun.file(filename).delete()
    } catch (e) {
      console.info(e)
    }
  }
}
