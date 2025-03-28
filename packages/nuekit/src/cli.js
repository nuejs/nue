#!/usr/bin/env bun

import { esMain, log, colors, version, getEngine, openUrl } from './util.js'


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
  const commands = ['serve', 'build', 'init', 'create', 'docs']
  const args = { paths: [], root: null }
  let opt

  expandArgs(argv).forEach((arg) => {
    // skip
    if (arg == '--') {

      // test suite
    } else if (arg.endsWith('.test.js')) {
      args.test = true

      // command
    } else if (!args.cmd && commands.includes(arg)) {
      args.cmd = arg

      // options
    } else if (!opt && arg[0] == '-') {

      // booleans
      if (['-p', '--production'].includes(arg)) args.is_prod = true
      else if (['-v', '--version'].includes(arg) && !args.cmd) args.version = true
      else if (['-n', '--dry-run'].includes(arg)) args.dryrun = true
      else if (['-h', '--help'].includes(arg)) args.help = true
      else if (['-v', '--verbose'].includes(arg)) args.verbose = true
      else if (['-b', '--esbuild'].includes(arg)) args.esbuild = true
      else if (['-l', '--lcss'].includes(arg)) args.lcss = true
      else if (['-d', '--deploy'].includes(arg)) args.deploy = args.is_prod = true
      else if (['-I', '--incremental'].includes(arg)) args.incremental = true
      else if (['-o', '--open'].includes(arg)) args.open = true

      // string values
      else if (['-e', '--environment'].includes(arg)) opt = 'env'
      else if (['-r', '--root'].includes(arg)) opt = 'root'
      else if (['-P', '--port'].includes(arg)) opt = 'port'
      else if (['-B', '--base'].includes(arg)) opt = 'base'

      // bad options
      else throw `Unknown option: "${arg}"`

    } else if (arg && arg[0] != '-') {
      if (opt) {
        args[opt] = opt == 'port' ? Number(arg) : arg
        // Number(alphabetic characters) is falsy. Check if port is really set:
        if (opt != 'port' || (opt == 'port' && args.port)) opt = null
      }
      else args.paths.push(arg)
    } else if (opt) throw `"${opt}" option is not set`
  })

  if (opt) throw `"${opt}" option is not set`

  return args
}

async function printHelp() {
  const { getHelp } = await import('./cli-help.js')
  console.info(getHelp())
}

async function printVersion() {
  log(`Nue ${version} ${colors.green('•')} ${getEngine()}`)
}

async function runCommand(args) {
  if (args.cmd == 'docs') return openUrl('https://nuejs.org/docs/')

  const { createKit } = await import('./nuekit.js')
  const { cmd = 'serve', dryrun, deploy, root = null, port } = args
  const init = cmd == 'init'

  if (!root) args.root = '.' // ensure root is unset for create, if not set manually

  console.info('')
  await printVersion()
  args.nuekit_version = version

  // create nue
  if (cmd == 'create') {
    const { create } = await import('./create.js')
    return await create({ ...args, root, port })
  }

  const nue = await createKit(args)
  if (!nue) return
  if (args.open) openUrl(`http://localhost:${nue.port}/`)

  // deployer (private repo)
  const { deploy: deployer } = deploy ? await import('nue-deployer') : {}

  // build
  if (init) {
    await nue.init(true)
    if (deploy) await deployer({ root: nue.dist, init: true })

  } else if (dryrun || deploy || args.paths[0] || cmd == 'build') {
    const paths = await nue.build(args.paths)
    if (!dryrun && deploy && paths[0]) await deployer({ paths, root: nue.dist, init })

    // serve
  } else {
    await nue.serve()
  }
}

// Only run main when called as real CLI
if (esMain(import.meta)) {

  const args = getArgs(process.argv.slice(2))

  // help
  if (args.help) {
    await printHelp()

    // version
  } else if (args.version) {
    await printVersion()

    // command
  } else if (!args.test) {
    try {
      await runCommand(args)
    } catch (e) {
      console.info(e)
    }
  }
}
