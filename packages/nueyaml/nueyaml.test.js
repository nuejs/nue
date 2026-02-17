import {
  stripComments,
  validateIndentation,
  isNumber,
  parseValue,
  parseYAMLArray,
  parseYAML
} from './nueyaml'

// stripComments
test('stripComments inline', () => {
  expect(stripComments('key: value # comment')).toBe('key: value')
})

test('stripComments hash in value', () => {
  expect(stripComments('color: #ccc')).toBe('color: #ccc')
  expect(stripComments('pass: secret#123#abc')).toBe('pass: secret#123#abc')
})

// validateIndentation
test('validateIndentation tabs rejected', () => {
  expect(() => validateIndentation(['\tkey: value'])).toThrow('Tabs not allowed')
})

test('validateIndentation tabs in value ok', () => {
  expect(() => validateIndentation(['key: "value\twith\ttab"'])).not.toThrow()
})

test('validateIndentation inconsistent', () => {
  expect(() => validateIndentation(['  key:', '   bad: value'])).toThrow('Inconsistent indentation')
})

// isNumber
test('isNumber valid', () => {
  expect(isNumber('42')).toBe(true)
  expect(isNumber('-3.14')).toBe(true)
})

test('isNumber invalid', () => {
  expect(isNumber('00800')).toBe(false)
  expect(isNumber('')).toBe(false)
  expect(isNumber('-')).toBe(false)
})

// parseValue
test('parseValue primitives', () => {
  expect(parseValue('hello')).toBe('hello')
  expect(parseValue('42')).toBe(42)
  expect(parseValue('true')).toBe(true)
  expect(parseValue('')).toBe(null)
})

test('parseValue quoted', () => {
  expect(parseValue('"hello"')).toBe('hello')
  expect(parseValue("'world'")).toBe('world')
  expect(parseValue('a "quoted" word')).toBe('a "quoted" word')
})

test('parseValue dates', () => {
  expect(parseValue('2024-01-15')).toEqual(new Date('2024-01-15'))
  expect(parseValue('2024-01-15T10:30:00Z')).toEqual(new Date('2024-01-15T10:30:00Z'))
})

// parseYAMLArray
test('parseYAMLArray valid', () => {
  expect(parseYAMLArray('tags: [one, two, 3]')).toEqual(['one', 'two', 3])
  expect(parseYAMLArray('empty: []')).toEqual([])
})

test('parseYAMLArray not arrays', () => {
  expect(parseYAMLArray('hey [foo]')).toBeNull()
  expect(parseYAMLArray('hey: "[foo]"')).toBeNull()
  expect(parseYAMLArray('hey: [foo](/bar)')).toBeNull()
})

// parseYAML integration
test('parseYAML nested objects', () => {
  expect(parseYAML('app:\n  name: Test\n  port: 3000')).toEqual({
    app: { name: 'Test', port: 3000 }
  })
})

test('parseYAML array of objects', () => {
  const input = `servers:
  - name: web-01
    ip: 192.168.1.1
  - name: web-02
    ip: 192.168.1.2`

  expect(parseYAML(input)).toEqual({
    servers: [
      { name: 'web-01', ip: '192.168.1.1' },
      { name: 'web-02', ip: '192.168.1.2' }
    ]
  })
})

test('parseYAML nested arrays', () => {
  const { cats } = parseYAML('cats:\n  - First\n    - Item 1\n    - Item 2')
  expect(cats).toEqual([{ value: 'First', items: ['Item 1', 'Item 2'] }])
})

test('parseYAML multiline string', () => {
  expect(parseYAML('desc:\n  Line one\n  Line two')).toEqual({
    desc: 'Line one\nLine two'
  })
})

test('parse complex key', () => {
  expect(parseYAML('/api/:id: handler')).toEqual({ '/api/:id': 'handler' })
})

test('parse complex value', () => {
  expect(parseYAML('test: "hello: world"')).toEqual({ test: 'hello: world' })
})

test('parseYAML real config', () => {
  const input = `site:
  name: Acme Inc
  features: [auth, cache]

posts:
  - title: Hello
    tags: [intro]
    cron:
      - 10 * * *
      - 20 * * *`

  expect(parseYAML(input)).toEqual({
    site: { name: 'Acme Inc', features: ['auth', 'cache'] },
    posts: [{
      title: 'Hello',
      tags: ['intro'],
      cron: ['10 * * *', '20 * * *']
    }]
  })
})