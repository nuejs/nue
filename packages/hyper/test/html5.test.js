import { addContext } from '../src/compiler/html5.js'

// addContext tests
test('scopes simple variable', () => {
  expect(addContext('className')).toBe('_.className')
})

test('preserves reserved words', () => {
  expect(addContext('Math.PI')).toBe('Math.PI')
})

test('handles math operations', () => {
  expect(addContext('x + y * 2')).toBe('_.x + _.y * 2')
})

test('handles array access', () => {
  expect(addContext('items[0].name')).toBe('_.items[0].name')
})

test('handles ternary with multiple variables', () => {
  expect(addContext('x > 0 ? y : z')).toBe('_.x > 0 ? _.y : _.z')
})


test('handles nested function calls', () => {
  expect(addContext('format(getName(user))'))
    .toBe('_.format(_.getName(_.user))')
})

test('handles complex expression', () => {
  expect(addContext('cute ? prettyDate(date) : Date.now()', ['prettyDate']))
    .toBe('_.cute ? prettyDate(_.date) : Date.now()')
})

