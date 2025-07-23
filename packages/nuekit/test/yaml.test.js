import {
  stripComments,
  measureIndent,
  isNumber,
  parseValue,
  parseArrayItems,
  detectStructure,
  buildObject,
  validateIndentation,
  parseYAML
} from '../src/yaml.js'

// stripComments tests
describe('stripComments', () => {
  test('no comments', () => {
    expect(stripComments('key: value')).toBe('key: value')
  })

  test('line comment', () => {
    expect(stripComments('key: value # comment')).toBe('key: value')
  })

  test('full comment', () => {
    expect(stripComments('# full comment')).toBe('')
  })

  test('hash in string', () => {
    expect(stripComments('key: value#notcomment')).toBe('key: value#notcomment')
  })
})

// measureIndent tests
describe('measureIndent', () => {
  test('spaces', () => {
    expect(measureIndent('key: value')).toBe(0)
    expect(measureIndent('  key: value')).toBe(2)
    expect(measureIndent('    key: value')).toBe(4)
  })
})

// isNumber tests
describe('isNumber', () => {
  test('valid numbers', () => {
    expect(isNumber('42')).toBe(true)
    expect(isNumber('3.14')).toBe(true)
    expect(isNumber('-42')).toBe(true)
  })

  test('invalid numbers', () => {
    expect(isNumber('hello')).toBe(false)
    expect(isNumber('')).toBe(false)
    expect(isNumber('-')).toBe(false)
  })
})

// parseValue tests
describe('parseValue', () => {
  test('types', () => {
    expect(parseValue('hello')).toBe('hello')
    expect(parseValue('42')).toBe(42)
    expect(parseValue('true')).toBe(true)
    expect(parseValue('false')).toBe(false)
    expect(parseValue('')).toBe(null)
  })

  test('quoted strings', () => {
    expect(parseValue('"hello"')).toBe('hello')
    expect(parseValue("'hello'")).toBe('hello')
    expect(parseValue('a "quoted" word')).toBe('a "quoted" word')
  })

  test('dates', () => {
    expect(parseValue('2024-01-15')).toEqual(new Date('2024-01-15'))
    expect(parseValue('2024-01-15T10:30:00Z')).toEqual(new Date('2024-01-15T10:30:00Z'))
  })
})

// parseArrayItems tests
describe('parseArrayItems', () => {
  test('arrays', () => {
    expect(parseArrayItems('tags: [one, two, three]')).toEqual(['one', 'two', 'three'])
    expect(parseArrayItems('nums: [1, 2, 3]')).toEqual([1, 2, 3])
    expect(parseArrayItems('empty: []')).toEqual([])
    expect(parseArrayItems('key: value')).toBe(null)
  })
})

// validateIndentation tests
describe('validateIndentation', () => {
  test('valid indentation', () => {
    expect(() => validateIndentation(['  key: value'])).not.toThrow()
    expect(() => validateIndentation(['  key:', '    nested: value'])).not.toThrow()
  })

  test('invalid indentation', () => {
    expect(() => validateIndentation(['\tkey: value'])).toThrow('Tabs not allowed for indentation')
    expect(() => validateIndentation(['key: "value\twith\ttab"'])).not.toThrow()
    expect(() => validateIndentation(['  key:', '   bad: value'])).toThrow('Inconsistent indentation')
  })
})

// detectStructure tests
describe('detectStructure', () => {
  test('basic structures', () => {
    expect(detectStructure(['name: John'])).toEqual([{
      type: 'keyvalue', key: 'name', value: 'John', indent: 0, lineIndex: 0
    }])

    expect(detectStructure(['- apple'])).toEqual([{
      type: 'arrayitem', value: 'apple', indent: 0, lineIndex: 0
    }])

    expect(detectStructure(['- name: John'])).toEqual([{
      type: 'arrayitem', key: 'name', value: 'John', indent: 0, lineIndex: 0
    }])
  })

  test('complex keys', () => {
    expect(detectStructure(['/app/:view:id: baz'])).toEqual([{
      type: 'keyvalue', key: '/app/:view:id', value: 'baz', indent: 0, lineIndex: 0
    }])
  })

  test('multiline and comments', () => {
    expect(detectStructure(['description:', '  line one', '  line two'])).toEqual([
      { type: 'keyvalue', key: 'description', value: '', indent: 0, lineIndex: 0 },
      { type: 'multiline', value: 'line one', indent: 2, lineIndex: 1 },
      { type: 'multiline', value: 'line two', indent: 2, lineIndex: 2 }
    ])

    expect(detectStructure(['# comment', 'name: John # inline'])).toEqual([{
      type: 'keyvalue', key: 'name', value: 'John', indent: 0, lineIndex: 1
    }])
  })
})

// buildObject tests
describe('buildObject', () => {
  test('simple structures', () => {
    expect(buildObject([
      { type: 'keyvalue', key: 'name', value: 'John', indent: 0 }
    ])).toEqual({ name: 'John' })

    expect(buildObject([
      { type: 'keyvalue', key: 'items', value: '', indent: 0 },
      { type: 'arrayitem', value: 'first', indent: 2 },
      { type: 'arrayitem', value: 'second', indent: 2 }
    ])).toEqual({ items: ['first', 'second'] })
  })

  test('complex structures', () => {
    expect(buildObject([
      { type: 'keyvalue', key: 'users', value: '', indent: 0 },
      { type: 'arrayitem', key: 'name', value: 'John', indent: 2 },
      { type: 'keyvalue', key: 'age', value: '30', indent: 4 },
      { type: 'arrayitem', key: 'name', value: 'Jane', indent: 2 }
    ])).toEqual({
      users: [
        { name: 'John', age: 30 },
        { name: 'Jane' }
      ]
    })
  })
})

// Integration tests
describe('parseYAML', () => {
  test('basic parsing', () => {
    expect(parseYAML('name: John\nage: 30')).toEqual({ name: 'John', age: 30 })

    expect(parseYAML('tags: [one, two, three]')).toEqual({ tags: ['one', 'two', 'three'] })

    expect(parseYAML('items:\n  - first\n  - second')).toEqual({ items: ['first', 'second'] })
  })

  test('advanced features', () => {
    expect(parseYAML('message: "Hello world"\nvalue: \'single quotes\'')).toEqual({
      message: 'Hello world',
      value: 'single quotes'
    })

    expect(parseYAML('/api/users/:id: handler\npassword: secret#123#abc')).toEqual({
      '/api/users/:id': 'handler',
      password: 'secret#123#abc'
    })

    expect(parseYAML('description:\n  Multi-line\n  string content')).toEqual({
      description: 'Multi-line\nstring content'
    })
  })

  test('complex structure', () => {
    const input = `app:
  name: My App
  features: [auth, cache]

servers:
  - name: web-01
    ip: 192.168.1.1
  - name: web-02
    ip: 192.168.1.2`

    expect(parseYAML(input)).toEqual({
      app: { name: 'My App', features: ['auth', 'cache'] },
      servers: [
        { name: 'web-01', ip: '192.168.1.1' },
        { name: 'web-02', ip: '192.168.1.2' }
      ]
    })
  })

  test('validation errors', () => {
    expect(() => parseYAML('\tkey: value')).toThrow('Tabs not allowed for indentation')
    expect(() => parseYAML('  key:\n   bad: value')).toThrow('Inconsistent indentation')
  })
})