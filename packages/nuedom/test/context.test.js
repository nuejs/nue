
import { addContext } from '../src/compiler/context.js'

test('simple variable', () => {
  expect(addContext('className')).toBe('_.className')
})

test('handle reserved words', () => {
  expect(addContext('Math.PI')).toBe('Math.PI')
})

test('math operations', () => {
  expect(addContext('x + y * 2')).toBe('_.x + _.y * 2')
})

test('array access', () => {
  expect(addContext('items[0].name')).toBe('_.items[0].name')
})

test('ternary with multiple variables', () => {
  expect(addContext('x > 0 ? y : z')).toBe('_.x > 0 ? _.y : _.z')
})

test('plain string', () => {
  expect(addContext("'hello'")).toBe("'hello'")
})

test('dollar variable', () => {
  expect(addContext("$foo")).toBe("_.$foo")
})

test('this', () => {
  expect(addContext("this")).toBe("_")
})

test('$event variable', () => {
  expect(addContext("$event")).toBe("$e")
})

test('$event.target', () => {
  expect(addContext('$event.target')).toBe('$e.target')
})

test('string expression', () => {
  expect(addContext('a + "hello"')).toBe('_.a + "hello"')
})

test('nested function calls', () => {
  expect(addContext('format(getName(user))'))
    .toBe('_.format(_.getName(_.user))')
})

test('complex #1', () => {
  expect(addContext('cute ? prettyDate(date) : Date.now()', ['prettyDate']))
    .toBe('_.cute ? prettyDate(_.date) : Date.now()')
})

test('complex #2', () => {
  const expr = addContext('router.set({ foo: el.id })')
  expect(expr).toBe('_.router.set({ foo: _.el.id })')
})

// Function calls with multiple arguments
test('function calls with args', () => {
  expect(addContext('calculate(a, b, Math.max(x, y))'))
    .toBe('_.calculate(_.a, _.b, Math.max(_.x, _.y))')
})

// Method chaining
test('method chaining', () => {
  expect(addContext('users.filter(u => u.active).map(getName)'))
    .toBe('_.users.filter(_.u => _.u.active).map(_.getName)')
})


// Arrow functions
test('arrow functions', () => {
  expect(addContext('items.map(item => item.id * factor)'))
    .toBe('_.items.map(_.item => _.item.id * _.factor)')
})

// Logical operators
test('logical operators', () => {
  expect(addContext('user && user.name || defaultName'))
    .toBe('_.user && _.user.name || _.defaultName')
})

// Comparison chains
test('comparison chains', () => {
  expect(addContext('min <= value && value <= max'))
    .toBe('_.min <= _.value && _.value <= _.max')
})

// Nested objects
test('nested object literals', () => {
  expect(addContext('{ user: { name: userName, settings: { theme: currentTheme } } }'))
    .toBe('{ user: { name: _.userName, settings: { theme: _.currentTheme } } }')
})

// Array literals
test('array literals', () => {
  expect(addContext('[first, second, items[index]]'))
    .toBe('[_.first, _.second, _.items[_.index]]')
})

// Regular expressions
test('regex literals', () => {
  expect(addContext('/test/.test(input)'))
    .toBe('/test/.test(_.input)')
})

// Numbers and operators
test('numeric operations', () => {
  expect(addContext('price * 1.2 + tax - discount'))
    .toBe('_.price * 1.2 + _.tax - _.discount')
})

