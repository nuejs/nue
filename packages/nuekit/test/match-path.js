import { toPosix } from '../src/util.js'


// https://stackoverflow.com/questions/67325342/how-to-run-os-agnostic-jest-test-files-that-check-paths
// https://jestjs.io/docs/expect#expectextendmatchers
export function toMatchPath(actual, expected) {
  const { printReceived, printExpected, matcherHint } = this.utils

  const pass = toPosix(actual) == expected

  return {
    pass,
    message: () => [
      matcherHint(pass ? '.not.toMatchPath' : '.toMatchPath'),
      '',
      `Expected path to${pass ? ' not' : ''} match:`,
      '\t' + printExpected(expected),
      'Received:',
      '\t' + printReceived(actual),
    ].join('\n')
  }
}
