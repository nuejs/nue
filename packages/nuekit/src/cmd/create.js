
import { mkdir, rename, rm, readdir } from 'node:fs/promises' // <-- Nuevas importaciones
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
  if (!await Bun.file(path).exists()) throw new Error(`${path} not found`)
  console.log(`📦 Using local template: ${path}`)
  return Bun.file(path)
}

// download from github
//
export async function fetchZip(name, baseurl='https://github.com/nuejs/nue/raw/master/packages/templates') {
  const url = `${baseurl}/${name}.zip`
  const resp = await fetch(url)
  if (resp.status != 200) throw new Error(`${url} not found`)
  console.log(`📦 Downloading ${name} template...`)
  return resp
}


// Función de descompresión multiplataforma con TAR y post-procesamiento
export async function unzip(dir, zip) {
  const filename = `${dir}.zip`
  // Usamos un nombre único y simple para el directorio temporal
  const tempDir = `TEMP_${dir}`

  // 1. Escribir el zip temporalmente
  await Bun.write(filename, zip)

  try {
    // 2. Crear el directorio temporal y extraer el ZIP en él
    await mkdir(tempDir)

    // extract (expects "minimal" directory inside zip)
    const cmd = process.platform == 'win32' ? ['tar', '-xf', filename] : ['unzip', '-q', filename]
    const proc = Bun.spawn(cmd)
    const exitCode = await proc.exited

    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text()
      throw new Error(`Unpacking archive failed with exit code ${exitCode}: ${stderr}`)
    }

    // 3. Mover el contenido:
    // Sabemos que la extracción creó: TEMP_minimal/minimal/...

    // El directorio que queremos mover es: TEMP_minimal/minimal
    const extractedRootPath = join(tempDir, dir)

    // Mover (renombrar) TEMP_minimal/minimal a minimal
    // Si 'minimal' ya existe, la operación de 'rename' fallará.
    // Debemos asegurarnos de que el directorio final 'dir' no exista antes de esta llamada,
    // o usar un enfoque de copia/eliminación.

    // El 'create' inicial ya verifica si 'dir' existe.
    // Por lo tanto, el directorio 'dir' *no existe* en este punto,
    // lo que hace que rename sea seguro y efectivo.
    await rename(extractedRootPath, dir)

    // 4. Limpieza: Eliminar el directorio temporal.
    await rm(tempDir, { recursive: true, force: true })


  } catch (error) {
    // Asegurarse de que la limpieza ocurra incluso en caso de fallo intermedio
    try { await rm(tempDir, { recursive: true, force: true }) } catch (e) { console.info(e) }
    throw error // Relanzar el error para que sea capturado por 'create'
  } finally {
    // 5. Limpieza final: Eliminar el archivo .zip temporal
    try {
      await Bun.file(filename).delete()
    } catch (e) { console.info(e) }
  }
}
