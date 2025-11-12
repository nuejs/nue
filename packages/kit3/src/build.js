
import { join } from 'path'
import { createTree } from './tree'

const TYPES = ['css', 'js', 'html', 'md']
const MAX_SIZE = 2_000_000  // 2MB

export async function build(opts) {
  const { only=[], no_media, force, verbose } = opts
  let tree = opts.tree

  // tree option is for testing
  if (!tree) { tree = createTree(); await tree.load() }

  const last_deploy = await getLastDeployTime()

  // deployable files
  const subset = tree.getAll().filter(asset => {

    // web files only
    if (!TYPES.includes(asset.type)) return false

    // matches only
    if (only.length) return only.some(str => asset.filepath.includes(str))

    // skip media
    if (no_media && isMedia(asset.file.type)) return false

    // skip large files
    if (asset.file.size > MAX_SIZE) {
      console.warn('Skipping file (too big)', asset.path, formatSize(asset.file.size))
      return false
    }

    // updated files only
    // if (!force && asset.file.lastModified < last_deploy) return false

    // no shared conent
    if (asset.site == '@base' && asset.is_md) return false

    return true
  })


  // build one
  async function buildAsset(asset) {
    const str = await tree.build(asset)
    const path = join('.dist', join(asset.site, asset.path).replace('.md', '.html'))
    await Bun.file(path).write(str)
    if (verbose) console.info(path)
  }

  // build all
  await Promise.all(subset.map(buildAsset))

}

function isMedia(mime) {
  return mime.includes('image') || mime.includes('video')
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
}


async function getLastDeployTime() {
  return null
}


