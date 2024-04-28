#!/usr/bin/env bun

import { log, colors } from './util.js'
import esMain from 'es-main'
import { sep } from 'node:path'

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
  const checkExecutable = /[\\\/]nue(\.(cmd|ps1|bunx|exe))?$/
  let opt

  expandArgs(argv.slice(1)).forEach((arg, i) => {
    // skip
    if (arg.endsWith(sep + 'cli.js') || checkExecutable.test(arg) || arg == '--') {

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
      else if (['-b', '--esbuild'].includes(arg)) args.esbuild = true
      else if (['-P', '--push'].includes(arg)) args.push = true
      else if (['-I', '--init'].includes(arg)) args.init = true

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
  const pathname = new URL('../package.json', import.meta.url).pathname
  const path = process.platform === "win32" && pathname.startsWith('/') ? pathname.slice(1) : pathname
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
  const v = await getVersion()
  log(`Nue ${v} ${colors.green('•')} ${getEngine()}`)
  return v
}

async function runCommand(args) {
  const { createKit } = await import('./nuekit.js')
  console.info('')

  args.nuekit_version = await printVersion()
  const nue = await createKit(args)

  const { cmd='serve', dryrun, push } = args

  // stats
  if (cmd == 'stats') await nue.stats(args)

  // build
  else if (push || args.paths[0] || cmd == 'build') {
    const paths = await nue.build(args.paths, dryrun)

    // deploy (private repo ATM)
    if (!dryrun && push) {
      const { deploy } = await import('nue-deployer')
      await deploy(paths, { root: nue.dist, init: args.init })
    }

  // serve
  } else await nue.serve()

}

// Only run main when called as real CLI
if (esMain(import.meta)) {

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

}
