#!/usr/bin/env bun

import { log, colors } from './util.js'

// [-npe] --> [-n, -p, -e]
export function expandArgs(args) {
  const arr = []
  args.forEach(arg => {
    if (arg[0] == '-' && arg[1] != '-' && arg[2]) {
      arg.slice(1).split('').forEach(el => arr.push('-' + el))
    } else {
      arr.push(arg)
    }
  })
  return arr
}

// TODO: tests
export function getArgs(argv) {
  const commands = ['serve', 'build', 'stats']
  const args = { paths: [], root: '.' }
  let opt

  expandArgs(argv.slice(1)).forEach((arg, i) => {

    // skip
    if (arg.endsWith('/cli.js') || arg == '--') {

    // test suite
    } else if (arg.endsWith('.test.js')) {
      args.test = true

    // command
    } else if (commands.includes(arg)) {
      args.cmd = arg

    // options
    } else if (arg[0] == '-') {

      // booleans
      if (['-p', '--production'].includes(arg)) args.is_prod = true
      else if (['-v', '--version'].includes(arg) && !args.cmd) args.version = true
      else if (['-n', '--dry-run'].includes(arg)) args.dryrun = true
      else if (['-h', '--help'].includes(arg)) args.help = true
      else if (['-v', '--verbose'].includes(arg)) args.verbose = true
      else if (['-s', '--stats'].includes(arg)) args.stats = true

      // string values
      else if (['-e', '--environment'].includes(arg)) opt = 'env'
      else if (['-r', '--root'].includes(arg)) opt = 'root'

      // bad options
      else if (opt) throw `"${opt}" option is not set`
      else throw `Unknown option: "${arg}"`

    } else if (arg) {
      if (opt) { args[opt] = arg; opt = null }
      else args.paths.push(arg)
    }
  })

  return args
}

// read from package.json
async function getVersion() {
  const { promises } = await import('fs')
  const path = new URL('../package.json', import.meta.url).pathname
  const json = await promises.readFile(path, 'utf-8')
  return JSON.parse(json).version
}

function getEngine() {
  const v = process.versions
  return process.isBun ? 'Bun ' + v.bun : 'Node ' + v.node
}

async function printHelp() {
  const { getHelp } = await import('./cli-help.js')
  console.info(getHelp())
}

async function printVersion() {
  log(`Nue ${await getVersion()} ${colors.green('•')} ${getEngine()}`)
}

async function runCommand(args) {
  const { createKit } = await import('./nuekit.js')
  const nue = await createKit(args)
  console.info('')
  await printVersion()

  // build
  const { cmd='serve' } = args

  if (cmd == 'build') await nue.build(args.paths, args.dryrun)

  // serve
  else if (cmd == 'serve') await nue.serve()

  // stats
  else if (cmd == 'stats') await nue.stats()
}

const args = getArgs(process.argv)

// help
if (args.help) {
  await printHelp()

// version
} else if (args.version) {
  await printVersion()

// root is required
} else if (!args.root) {
  console.info('Project root not specified')

// command
} else if (!args.test) {
  try {
    await runCommand(args)
  } catch (e) {
    console.info(e)
  }
}









