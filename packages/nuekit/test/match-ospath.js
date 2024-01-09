import { normalize } from 'node:path'

// https://stackoverflow.com/questions/67325342/how-to-run-os-agnostic-jest-test-files-that-check-paths
// https://jestjs.io/docs/expect#expectextendmatchers
export function toMatchOSPath(actual, expected) {

    const passMessage = (actual, expected) => () => `${this.utils.matcherHint('.not.toMatchPath')}

    Expected value not to match:
    ${this.utils.printExpected(expected)}
    Received:
    ${this.utils.printReceived(actual)}`

    const failMessage = (actual, expected) => () => `${this.utils.matcherHint('.toMatchPath')}

    Expected value to match:
    ${this.utils.printExpected(expected)}
    Received:
    ${this.utils.printReceived(actual)}`

    const normalised = normalize(expected)
    return actual === normalised
        ? { pass: true, message: passMessage(actual, normalised) }
        : { pass: false, message: failMessage(actual, normalised) }
}