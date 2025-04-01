
/*
  Not in use currently
*/

import { promises as fs } from 'node:fs'
import { join, extname, parse as parsePath } from 'node:path'

import { fswalk } from './nuefs.js'
import { colors, sortCSS } from './util.js'


async function readSize(dist, path) {
  const raw = await fs.readFile(join(dist, path), 'utf-8')
  return raw.length
}

export async function printStats(site, args) {
  if (args.dryrun) return

  const { dist, globals } = site
  let paths = await fswalk(dist)

  // filter paths
  if (args.paths[0]) paths = paths.filter(p => args.paths.find(m => p.includes(m)))

  // no @nue stuff
  paths = paths.filter(p => !p.startsWith('@nue'))

  const longest = paths.sort((a, b) => b.length - a.length)[0]

  // CSS sort
  sortCSS({ paths, globals, dir: '.' })

  let total = 0

  function print(title, size) {
    const padding = ' '.repeat(longest.length - title.length + 2)
    console.log(title + padding, colors.gray(size), colors.yellow(fmt(size)))
  }

  for (const path of paths) {
    const size = await readSize(dist, path)
    print(path, size)
    total += size
  }

  print('Total', total)
}

export function categorize(paths) {
  const cats = { style: [], scripts: [], islands: [], pages: [], media: [], spa: [] }
  const misc = []

  for (const path of paths) {
    const ext = extname(path).slice(1)
    const { base } = parsePath(path)

    const cat = ext == 'css' ? cats.style :
      ['js', 'ts'].includes(ext) ? cats.scripts :
        base == 'index.html' ? cats.spa :
          ext == 'yaml' || ext == 'html' ? misc :
            ext == 'dhtml' || ext == 'htm' ? cats.islands :
              ext == 'md' ? cats.pages :
                cats.media

    cat.push(path)
  }

  return cats
}


function sum(arr) {
  let total = 0
  arr.forEach(val => total += val)
  return total
}

function fmt(size) {
  return !size ? '-' : Math.round(size / 100) / 10 + 'k'
}
