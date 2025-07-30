
import { expandArgs, getArgs } from '../src/cli'

test('expandArgs', () => {
  expect(expandArgs(['--silent', '-pve'])).toEqual([ "--silent", "-p", "-v", "-e" ])
})

test('getArgs', () => {
  const args = getArgs([
    'build', '--silent', '--port', '2000', '--production', '-ni', '--', 'index.md', '.css'
  ])

  expect(args).toMatchObject({
    cmd: 'build',
    paths: [ 'index.md', '.css' ],
    is_prod: true,
    silent: true,
    dryrun: true,
    init: true,
    port: 2000,
  })
})

test('bad option', () => {
  expect(() => getArgs(['-k'])).toThrow('Unknown option: "-k"')
})