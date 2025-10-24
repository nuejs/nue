#!/usr/bin/env bun

import { join } from 'node:path'

async function getVersion() {
  const file = Bun.file(join(import.meta.dir, '../../package.json'))
  return (await file.json()).version
}

export const version = await getVersion()

export function getArgs(argv) {
  const commands = ['create', 'deploy']

  // default values
  const args = { paths: [] }
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

      else if (['-v', '--version'].includes(arg)) args.version = true

      // dev & preview options
      else if (['-p', '--port'].includes(arg)) opt = 'port'

      // build options
      else if (['-n', '--dry-run'].includes(arg)) args.dryrun = true

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
  nue                     # develop all sites
  nue -p 5000             # use a different port (default: 4000)

  nue deploy              # deploy all sites to production
  nue deploy <pattern>    # deploy only selected sites/files
  nue deploy --show       # only show what's being pushed
  nue deploy -h           # print deploy help

  nue create demo         # create an example multi-site setup

  nue -v or --version     # print version number
  nue -h or --help        # print this help
`

function format(line) {
  const colors = {
    white: str => `\x1b[37m${str}\x1b[0m`,
    gray: str => `\x1b[90m${str}\x1b[0m`,
    green: str => `\x1b[32m${str}\x1b[0m`,
    cyan: str => `\x1b[36m${str}\x1b[0m`,
  }

  const [main, comment] = line.split('#')
  if (!main) return

  let result = main
    .replace(/\bnue create\b/g, colors.white('nue create'))
    .replace(/\bnue deploy\b/g, colors.white('nue deploy'))
    .replace(/\bnue\b/g, colors.white('nue'))
    .replace(/(-[a-z]|--\w+)/g, match => colors.cyan(match))
    .replace(/\b\d+\b|<\w+>|\bdemo\b/g, match => colors.green(match))

  return result + colors.gray('#' + comment)
}

export function printHelp() {
  console.info(HELP.split('\n').map(format).join('\n'))
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
  const { cmd, paths } = args

  // create
  if (cmd == 'create') {
    const { create } = await import('./create')
    const [ name, dir ] = paths
    return await create(name, { dir })
  }

  // deploy
  if (cmd == 'deploy') {
    const { deploy } = await import('./deploy')
    await deploy(args)
  }

  if (!cmd) {
    const { start } = await import('../serve')
    await start(args)
  }
}

const { argv } = process

if (argv[1].endsWith('cli.js')) {
  const args = getArgs(argv.slice(2))
  await run(args)
}


