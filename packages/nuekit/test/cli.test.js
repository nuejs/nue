
import { expandArgs, getArgs } from '../src/cli'

test('expandArgs', () => {
  expect(expandArgs(['--silent', '-pve'])).toEqual([ "--silent", "-p", "-v", "-e" ])
})

test('getArgs', () => {
  const args = getArgs([
    'build', '--silent', '--port', '2000', '-ni', '--', 'index.md', '.css'
  ])

  expect(args).toMatchObject({
    cmd: 'build',
    paths: [ 'index.md', '.css' ],
    silent: true,
    dryrun: true,
    init: true,
    port: 2000,
  })
})

test('bad option', () => {
  expect(() => getArgs(['-k'])).toThrow('Unknown option: "-k"')
})