#!/usr/bin/env bun

import { printHelp, version } from './help.js'

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
  const args = { paths: [] }
  let opt

  expandArgs(argv).forEach((arg) => {

    // skip
    if (arg == '--') {

    // command
    } else if (!args.cmd && commands.includes(arg)) {
      args.cmd = arg

    // options
    } else if (!opt && arg[0] == '-') {

      // booleans
      if (['-h', '--help'].includes(arg)) args.help = true
      else if (['-v', '--version'].includes(arg)) args.version = true
      else if (['-p', '--production'].includes(arg)) args.is_prod = true
      else if (['-n', '--dry-run'].includes(arg)) args.dryrun = true
      else if (['-i', '--init'].includes(arg)) args.init = true
      else if (['-s', '--silent'].includes(arg)) args.silent = true

      // values
      else if (['-r', '--root'].includes(arg)) opt = 'root'
      else if (['-P', '--port'].includes(arg)) opt = 'port'

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
  console.info(`Nue ${ version } • Bun ${ Bun.version }`)
}

async function run(args) {

  // help
  if (args.help) return printHelp()

  // version
  if (args.version) return printVersion()


  // command
  const { createSite } = await import('./site.js')
  const { root, cmd, paths, is_prod } = args
  const site = await createSite(root, args)

  // not a nue directory
  if (!site) return

  if (cmd == 'push') {
    console.info('pushing', paths)

  } else if (cmd == 'create') {
    const [ app ] = paths
    console.info('creating', app)

  } else if (cmd == 'build' || paths.length) {
    await site.build()

  } else if (cmd == 'serve' || !cmd) {
    site.serve()
  }

}

const { argv } = process

if (argv[1].endsWith('cli.js')) {
  const args = getArgs(argv.slice(2))
  await run(args)
}



