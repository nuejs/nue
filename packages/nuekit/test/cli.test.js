
import { expandArgs, getArgs } from '../src/cli.js'


test('expandArgs', () => {
  expect(expandArgs(['--silent', '-pve'])).toEqual([ "--silent", "-p", "-v", "-e" ])
})

test('getArgs', () => {
  const args = getArgs([
    'build', '--silent', '--port', '2000', '-pn', '--', 'index.md', '.css'
  ])

  expect(args).toEqual({
    paths: [ "index.md", ".css" ],
    cmd: "build",
    silent: true,
    port: 2000,
    is_prod: true,
    dryrun: true,
  })
})

test('bad option', () => {
  expect(() => getArgs(['-k'])).toThrow('Unknown option: "-k"')
})