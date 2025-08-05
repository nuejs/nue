#!/usr/bin/env bun

import { printHelp } from './help'
import { version } from './system'

// [-npe] --> [-n, -p, -e]
export function expandArgs(args) {
  const arr = []
  args.forEach(str => {
    if (str[0] == '-' && str[1] != '-' && str[2]) {
      str.slice(1).split('').forEach(el => arr.push('-' + el))
    } else {
      arr.push(str)
    }
  })
  return arr
}


export function getArgs(argv) {
  const commands = ['serve', 'build', 'create', 'push']

  // default values
  const args = { paths: [], root: '.' }
  let opt

  expandArgs(argv).forEach((arg) => {

    // skip
    if (arg == '--') {

    // command
    } else if (!args.cmd && commands.includes(arg)) {
      args.cmd = arg

    // options
    } else if (!opt && arg[0] == '-') {

      // global options
      if (['-h', '--help'].includes(arg)) args.help = true
      else if (['-v', '--version'].includes(arg)) args.version = true
      else if (['-s', '--silent'].includes(arg)) args.silent = true
      else if (['-r', '--root'].includes(arg)) opt = 'root'

      // serve options
      else if (['-p', '--port'].includes(arg)) opt = 'port'

      // build options
      else if (['-n', '--dry-run'].includes(arg)) args.dryrun = true
      else if (['-i', '--init'].includes(arg)) args.init = true
      else if (['--verbose'].includes(arg)) args.verbose = true

      // values

      // bad argument
      else throw `Unknown option: "${arg}"`

    // values
    } else if (opt) {
      args[opt] = 1 * arg || arg
      opt = null

    } else {
      args.paths.push(arg)
    }
  })

  if (opt) throw `${opt} not set`

  return args
}


function printVersion() {
  console.log(`Nue ${ version } • Bun ${ Bun.version }`)
}

async function run(args) {

  // help
  if (args.help) return printHelp()

  // version
  printVersion()
  if (args.version) return


  // command
  const { readAssets } = await import('./assets.js')
  const { root, cmd, paths } = args
  const { assets, ignore } = await readAssets(root)
  args.ignore = ignore

  // not a nue directory
  if (!assets) return

  if (cmd == 'push') {
    console.log('pushing', paths)

  } else if (cmd == 'create') {
    const [ app ] = paths
    console.log('creating', app)

  } else if (cmd == 'build' || paths.length) {
    const { build } = await import('./build.js')
    await build(assets, args)

  } else if (cmd == 'serve' || !cmd) {
    const { serve } = await import('./serve.js')
    serve(assets, args)
  }

}

const { argv } = process

if (argv[1].endsWith('cli.js')) {
  const args = getArgs(argv.slice(2))
  await run(args)
}



