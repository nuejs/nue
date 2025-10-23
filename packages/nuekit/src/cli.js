#!/usr/bin/env bun

import { styleText } from 'node:util'
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
  const commands = ['serve', 'dev', 'build', 'preview', 'create', 'push']

  // default values
  const args = { paths: [] }
  let opt

  expandArgs(argv).forEach((arg) => {

    // skip
    if (arg == '--') {

    // command
    } else if (!args.cmd && commands.includes(arg)) {
      args.is_prod = arg == 'build'
      args.cmd = arg

    // options
    } else if (!opt && arg[0] == '-') {

      // global options
      if (['-h', '--help'].includes(arg)) args.help = true
      else if (['-v', '--version'].includes(arg)) args.version = true
      else if (['-s', '--silent'].includes(arg)) args.silent = true
      else if (['--verbose'].includes(arg)) args.verbose = true

      // dev & preview options
      else if (['-p', '--port'].includes(arg)) opt = 'port'

      // build options
      else if (['-n', '--dry-run'].includes(arg)) args.dryrun = true
      else if (['-i', '--init'].includes(arg)) args.init = true
      else if (['--clean'].includes(arg)) args.clean = true

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

const HELP = `
Usage
  nue [command] [options] [file_matches]
  nue -v or --version
  nue -h or --help

Commands
  serve     Start development server (default command)
  build     Build a production site
  preview   Preview the production site
  create    Use a project starter template

Options
  -p or --port          Serve/preview the site on this port
  -n or --dry-run       Show what would be built. Does not build anything
  -s or --silent        Suppress output messages
  -i or --init          build Nue runtime files (rare need)
  --verbose             Show detailed output
  --clean               Clean output directory before building

File matches
  Only build files that match the rest of the arguments. For example:
  "nue build .ts .css" will build all TypeScript and CSS files

Examples
  # serve current directory
  nue

  # build all Markdown and CSS files
  nue build .md .css

  # build with verbose output
  nue build --verbose

  # preview on specific port
  nue preview --port 8080

  # more examples
  https://nuejs.org/docs/cli

 ┏━┓┏┓┏┳━━┓
 ┃┏┓┫┃┃┃┃━┫  ${version}
 ┃┃┃┃┗┛┃┃━┫  nuejs.org
 ┗┛┗┻━━┻━━┛
`


function format(line) {
  return line.match(/^\w[\w ]+$/) ? styleText(['bold', 'white'],line) // titles
    : '┏┃┗'.includes(line.trim()[0]) ? styleText(['green'], line) // ascii art
    : line.includes('#') ? styleText(['cyan'], line) // comments
    : styleText(['gray'], line)
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
    const { create } = await import('./cmd/create')
    const [ name, dir ] = paths
    return await create(name, { dir })
  }

  // push (private repo ATM)
  if (cmd == 'push') {
    const { fswalk } = await import('./tools/fswalk')
    const { push } = await import('nuepush')
    const files = await fswalk('.dist')
    return await push(files, args)
  }

  // config
  const { readSiteConf } = await import('./conf')
  const conf = await readSiteConf(args)
  if (!conf) return console.error('Not a Nue directory')

  // preview
  if (cmd == 'preview') {
    const { preview } = await import('./cmd/preview')
    return await preview(conf, args)
  }

  // site
  const { createSite } = await import('./site')
  const site = await createSite(conf)

  // build
  if (cmd == 'build' || paths.length) {
    const { build } = await import('./cmd/build')
    await build(site, args)

  // dev | serve
  } else if (!cmd || cmd == 'dev' || cmd == 'serve') {
    const { serve } = await import('./cmd/serve')
    await serve(site, args)
  }

}

const { argv } = process

if (argv[1].endsWith('cli.js')) {
  const args = getArgs(argv.slice(2))
  await run(args)
}


