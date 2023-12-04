
import { join, extname, parse as parsePath } from 'node:path'
import { log, colors, getAppDir } from './util.js'
import { promises as fs } from 'node:fs'
import { fswalk } from './nuefs.js'

async function readSize(dist, path) {
  const raw = await fs.readFile(join(dist, path), 'utf-8')
  return raw.length
}

export async function readStats(dist, globals) {
  const paths = await fswalk(dist)

  async function getSize(appdir, ext) {
    let total = 0

    for (const path of paths.filter(p => p.startsWith(appdir) && p.endsWith(ext))) {
      total += await readSize(dist, path)
    }
    return total
  }

  async function getGlobals(ext) {
    let total = 0
    for (const dir of globals) total += await getSize(dir, ext)
    return total
  }

  // returned data
  const data = []

  // globals
  const gcss = await getGlobals('.css')
  const gjs = await getGlobals('.js')

  data.push(['Globals', '-', fmt(gcss), fmt(gjs)])

  // pages
  for (const path of paths.filter(el => el.endsWith('.html'))) {
    const { dir } = parsePath(path)
    const appdir = getAppDir(dir)
    const html = await readSize(dist, path)
    const css = await getSize(appdir, '.css')
    const js = await getSize(appdir, '.js')
    const label = path.replace('index.html', '') || 'Front page (/)'
    data.push([label, fmt(html), fmt(gcss + css), fmt(gjs + js)])
  }

  return data
}


export function printTable(head, rows) {
  const PADDING = 7

  rows.unshift(head)

  const maxes = new Array(rows[0].length).fill(0).map((_, i) => {
    const vals = rows.map(row => row[i].toString().length)
    return Math.max(...vals)
  })

  console.info('\n')

  rows.forEach((row, i) => {
    const { cyan, green, gray } = colors
    const cols = row.map((val, j) => {
      const color_val = !i ? val : val == 'Globals' ? green(val) : !j ? cyan(val) : gray(val)
      return color_val + ' '.repeat(maxes[j] - val.toString().length)
    })

    console.info(cols.join(' '.repeat(PADDING)))
    if (!i) console.info('–'.repeat(sum(maxes) + (maxes.length-1) * PADDING))
  })
}


export function categorize(paths) {
  const cats = { style: [], scripts: [], islands: [], pages: [], media: [], spa: [] }
  const misc = []

  for (const path of paths) {
    const ext = extname(path).slice(1)
    const { base } = parsePath(path)

    const cat = ['style', 'css', 'styl'].includes(ext) ? cats.style :
      ['js', 'ts'].includes(ext) ? cats.scripts :
      ext == 'yaml' || base == 'layout.html' ? misc :
      base == 'index.html' ? cats.spa :
      ext ==  'nue' ? cats.islands :
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

