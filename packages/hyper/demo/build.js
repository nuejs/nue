
import { compile, render } from '..'
import { $ } from 'bun'


async function read(path) {
  return $`cat < ${path}`.text()
}

async function readdir(dir, suffix) {
  const paths = (await $`ls ${dir}`.quiet()).text().split('\n').sort()
  const arr = []

  for (const path of paths) {
    if (path.endsWith(suffix)) arr.push(await read(`${dir}/${path}`))
  }

  return arr.join('\n')
}


async function minify(dir, file) {
  return await Bun.build({
    entrypoints: [`${dir}/${file}`],
    naming: "[dir]/[name].min.[ext]",
    minify: true,
    outdir: dir,
  })
}

async function compileTo(dir, filename, html) {
  const js = compile(html)
  await Bun.write(`${dir}/${filename}`, js)
  await minify(dir, filename)
}

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around delimiters
    .trim() // Remove leading/trailing spaces
}

async function buildHello() {
  const src = '<h1>Hello, ${ name }!</h1>'
  await compileTo('hello-world/builds', 'hello.js', src)
}

async function buildTable() {
  const src = await read('table/table-component.html')
  await compileTo('table/builds', 'table.js', src)
}


async function readDashboardCSS() {
  const css = []
  for (const dir of ['css', 'css/components', 'dashboard/css']) {
    css.push(await readdir(dir, '.css'))
  }
  return css.join('\n')
}

async function buildDashboardCSS() {
  const minified = minifyCSS(await readDashboardCSS())
  Bun.write('dashboard/builds/dashboard.css', minified)
}

async function buildDashboard() {
  const html = await readdir('dashboard/components', '.html')
  await compileTo('dashboard/builds', 'dashboard.js', html)
}

async function renderDashboard() {
  const page = await read('dashboard/ssr/page-source.html')
  const components = await readdir('dashboard/components', '.html')
  const { data } = await import('./dashboard/data/rams.js')

  const html = render(page + components, { data })
  Bun.write('dashboard/ssr/ramsian.html', html)
}


// await buildHello()
// await buildTable()
// await buildDashboardCSS()
await buildDashboard()
// await renderDashboard()
