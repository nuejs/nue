
// pseudocode

export async function create(name=minimal) {

  if (await Bun.file(name).exists()) return console.log('Already created')

  await fs.mkdir(name, { recursive: true })

  // download archive
  const url = `https://github.com/nuejs/nue/releases/latest/download/${name}.zip`
  const zip = await fetch(url)

  // error?
  if (zip.status != 200) return console.error(`Error loading ${url}`)

  // unzip

  // remove zip

  // inform
  console.info(`Created template "${name}"`)
  console.info(`Next step: cd ${name} \n nue`)

}