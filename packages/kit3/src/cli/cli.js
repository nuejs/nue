#!/usr/bin/env bun

import { styleText as color } from 'node:util'
import { join  } from 'node:path'
import { createTree } from '../tree'


async function getVersion() {
  const file = Bun.file(join(import.meta.dir, '../../package.json'))
  return (await file.json()).version
}

export const version = await getVersion()

export function getArgs(argv) {
  const commands = [ 'create', 'build', 'push' ]

  // default values
  const args = { paths: [], version }
  let opt

  argv.forEach((arg) => {

    // skip
    if (arg == '--') {

    // command
    } else if (!args.cmd && commands.includes(arg)) {
      args.cmd = arg

    // options
    } else if (!opt && arg[0] == '-') {

      // global options
      if (['-h', '--help'].includes(arg)) args.help = true

      else if (['-v', '--version'].includes(arg)) args.versionOnly = true

      // dev & preview options
      else if (['-p', '--port'].includes(arg)) opt = 'port'

      // build options
      else if (['-s', '--silent'].includes(arg)) args.silent = true
      else if (['-n', '--dry-run'].includes(arg)) args.dryrun = true
      else if (['--verbose'].includes(arg)) args.verbose = true
      else if (['--no-media'].includes(arg)) args.no_media = true
      else if (['--force'].includes(arg)) args.force = true
      else if (['--init'].includes(arg)) args.init = true
      else if (['--all'].includes(arg)) args.all = true

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

const HELP = `
  nue -h or --help         # print this help
  nue -v or --version      # print version number

  nue                      # develop all sites
  nue -p 5000              # use a different port (default: 4000)
  nue -s or --silent       # silent dev mode

  nue push               # push all sites to production
  nue push blog/ .css    # only push matching files/folders
  nue push --show        # only show what's being pushed
  nue push -h            # print push help

  nue create multi-site    # create multi-site setup

`

function format(line) {
  const [main, comment] = line.split('#')
  if (!main) return

  let result = main
    .replace(/push|create/, match => color('green', match))
    .replace(/ (-[a-z]|--\w+)/g, match => color('cyan', match))

  return result + color('gray', '#' + comment)
}

export function printHelp() {
  console.info(HELP.split('\n').map(format).join('\n'))
}


function printVersion() {
  const msg = `Nue ${ version } • Bun ${ Bun.version }`
  console.log(`\n   ${ color('cyan', msg) }  \n`)
}

async function run(args) {

  // help
  if (args.help) return printHelp()

  // version
  printVersion()
  if (args.versionOnly) return

  // command
  const { cmd, paths } = args


  // create
  if (cmd == 'create') {
    const { create } = await import('./create')
    const [ name, dir ] = paths
    return await create(name, { dir })
  }

  // tree
  const tree = createTree()
  await tree.load()

  // build
  if (cmd == 'build') {
    const { build } = await import('./build')
    await build(tree, args)
  }

  // push
  if (cmd == 'push') {
    const { push } = await import('./push')
    await push(tree, args)
  }

  if (!cmd || cmd == 'serve' || cmd == 'dev') {
    const { start } = await import('./serve')
    await start(tree, args)
  }
}

const { argv } = process

if (argv[1].endsWith('cli.js')) {
  const args = getArgs(argv.slice(2))
  await run(args)
}


