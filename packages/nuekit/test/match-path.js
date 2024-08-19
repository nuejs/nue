import { toPosix } from '../src/util.js'

// https://stackoverflow.com/questions/67325342/how-to-run-os-agnostic-jest-test-files-that-check-paths
// https://jestjs.io/docs/expect#expectextendmatchers
export function toMatchPath(actual, expected) {
  const { printReceived, printExpected, matcherHint } = this.utils

  const pass = toPosix(actual) == expected

  return {
    pass,
    message: () => pass
      ? matcherHint('.not.toMatchPath') +
      '\n\n' +
      'Expected path not to match:\n' +
      `  ${printExpected(expected)}\n` +
      'Received:\n' +
      `  ${printReceived(actual)}`
      : matcherHint('.toMatchPath') +
      '\n\n' +
      'Expected path to match:\n' +
      `  ${printExpected(expected)}\n` +
      'Received:\n' +
      `  ${printReceived(actual)}`
  }
}
