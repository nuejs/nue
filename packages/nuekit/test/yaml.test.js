
import {
  parseArrayItems,
  detectStructure,
  stripComments,
  measureIndent,
  buildObject,
  parseValue,
  parseYAML,
  isNumber } from '../src/yaml.js'


// stripComments tests
describe('stripComments', () => {
  test('no comments', () => {
    expect(stripComments('key: value')).toBe('key: value')
  })

  test('line comment', () => {
    expect(stripComments('# line comment')).toBe('')
  })

  test('EOL comment', () => {
    expect(stripComments('key: value # comment')).toBe('key: value')
  })


  test('hash in string', () => {
    expect(stripComments('key: value#notcomment')).toBe('key: value#notcomment')
  })

  test('hash in value', () => {
    expect(stripComments('href: index.html#baz # comment')).toBe('href: index.html#baz')
  })
})

// measureIndent tests
describe('measureIndent', () => {
  test('no indent', () => {
    expect(measureIndent('key: value')).toBe(0)
  })

  test('spaces', () => {
    expect(measureIndent('  key: value')).toBe(2)
  })

  test('tabs', () => {
    expect(measureIndent('\tkey: value')).toBe(4)
  })

  test('mixed', () => {
    expect(measureIndent(' \tkey: value')).toBe(5)
  })
})

// isNumber tests
describe('isNumber', () => {
  test('integer', () => {
    expect(isNumber('42')).toBe(true)
  })

  test('decimal', () => {
    expect(isNumber('3.14')).toBe(true)
  })

  test('negative', () => {
    expect(isNumber('-42')).toBe(true)
  })

  test('string', () => {
    expect(isNumber('hello')).toBe(false)
  })

  test('empty', () => {
    expect(isNumber('')).toBe(false)
  })

  test('just minus', () => {
    expect(isNumber('-')).toBe(false)
  })
})

// parseValue tests
describe('parseValue', () => {
  test('string', () => {
    expect(parseValue('hello')).toBe('hello')
  })

  test('quoted string', () => {
    expect(parseValue('"hello"')).toBe('hello')
    expect(parseValue("'hello'")).toBe('hello')
    expect(parseValue('Say "hello"')).toBe('Say "hello"')
  })

  test('number', () => {
    expect(parseValue('42')).toBe(42)
  })

  test('decimal', () => {
    expect(parseValue('3.14')).toBe(3.14)
  })

  test('true', () => {
    expect(parseValue('true')).toBe(true)
  })

  test('false', () => {
    expect(parseValue('false')).toBe(false)
  })

  test('null', () => {
    expect(parseValue('')).toBe(null)
  })

  test('date', () => {
    expect(parseValue('2024-01-15')).toEqual(new Date('2024-01-15'))
  })

  test('datetime', () => {
    expect(parseValue('2024-01-15T10:30:00Z')).toEqual(new Date('2024-01-15T10:30:00Z'))
  })

  test('whitespace', () => {
    expect(parseValue('  hello  ')).toBe('hello')
  })
})

// parseArrayItems tests
describe('parseArrayItems', () => {
  test('simple array', () => {
    expect(parseArrayItems('tags: [one, two, three]')).toEqual(['one', 'two', 'three'])
  })

  test('numbers', () => {
    expect(parseArrayItems('nums: [1, 2, 3]')).toEqual([1, 2, 3])
  })

  test('mixed', () => {
    expect(parseArrayItems('mixed: [hello, 42, true]')).toEqual(['hello', 42, true])
  })

  test('empty', () => {
    expect(parseArrayItems('empty: []')).toEqual([])
  })

  test('no array', () => {
    expect(parseArrayItems('key: value')).toBe(null)
  })
})

// detectStructure tests
describe('detectStructure', () => {
  test('simple keyvalue', () => {
    const blocks = detectStructure(['name: John'])
    expect(blocks).toEqual([{
      type: 'keyvalue',
      key: 'name',
      value: 'John',
      indent: 0,
      lineIndex: 0
    }])
  })

  test('keyvalue with colon', () => {
    const blocks = detectStructure(['val: foo: bar'])
    expect(blocks).toEqual([{
      type: 'keyvalue',
      key: 'val',
      value: 'foo: bar',
      indent: 0,
      lineIndex: 0
    }])
  })

  test('complex value', () => {
    const blocks = detectStructure(['val: +=#)(=//##2))'])
    expect(blocks).toEqual([{
      type: "keyvalue",
      key: "val",
      value: "+=#)(=//##2))",
      indent: 0,
      lineIndex: 0,
    }])
  })

  test('complex key', () => {
    const blocks = detectStructure(['/app/:view:id: baz'])
    expect(blocks).toEqual([{
      type: "keyvalue",
      key: "/app/:view:id",
      value: "baz",
      indent: 0,
      lineIndex: 0,
    }])
  })

  test('simple arrayitem', () => {
    const blocks = detectStructure(['- apple'])
    expect(blocks).toEqual([{
      type: 'arrayitem',
      value: 'apple',
      indent: 0,
      lineIndex: 0
    }])
  })

  test('arrayitem with key', () => {
    const blocks = detectStructure(['- name: John'])
    expect(blocks).toEqual([{
      type: 'arrayitem',
      key: 'name',
      value: 'John',
      indent: 0,
      lineIndex: 0
    }])
  })

  test('multiline content', () => {
    const blocks = detectStructure(['description:', '  This is', '  multiline'])
    expect(blocks).toEqual([
      { type: 'keyvalue', key: 'description', value: '', indent: 0, lineIndex: 0 },
      { type: 'multiline', value: 'This is', indent: 2, lineIndex: 1 },
      { type: 'multiline', value: 'multiline', indent: 2, lineIndex: 2 }
    ])
  })

  test('nested structure', () => {
    const blocks = detectStructure(['user:', '  name: John', '  age: 30'])
    expect(blocks).toEqual([
      { type: 'keyvalue', key: 'user', value: '', indent: 0, lineIndex: 0 },
      { type: 'keyvalue', key: 'name', value: 'John', indent: 2, lineIndex: 1 },
      { type: 'keyvalue', key: 'age', value: '30', indent: 2, lineIndex: 2 }
    ])
  })

  test('array with objects', () => {
    const blocks = detectStructure(['items:', '  - name: first', '    value: 1', '  - name: second'])
    expect(blocks).toEqual([
      { type: 'keyvalue', key: 'items', value: '', indent: 0, lineIndex: 0 },
      { type: 'arrayitem', key: 'name', value: 'first', indent: 2, lineIndex: 1 },
      { type: 'keyvalue', key: 'value', value: '1', indent: 4, lineIndex: 2 },
      { type: 'arrayitem', key: 'name', value: 'second', indent: 2, lineIndex: 3 }
    ])
  })

  test('comments ignored', () => {
    const blocks = detectStructure(['# comment', 'name: John # inline'])
    expect(blocks).toEqual([{
      type: 'keyvalue',
      key: 'name',
      value: 'John',
      indent: 0,
      lineIndex: 1
    }])
  })

  test('empty lines ignored', () => {
    const blocks = detectStructure(['name: John', '', 'age: 30'])
    expect(blocks).toEqual([
      { type: 'keyvalue', key: 'name', value: 'John', indent: 0, lineIndex: 0 },
      { type: 'keyvalue', key: 'age', value: '30', indent: 0, lineIndex: 2 }
    ])
  })
})

// buildObject tests
describe('buildObject', () => {
  test('simple keyvalue', () => {
    const blocks = [{ type: 'keyvalue', key: 'name', value: 'John', indent: 0 }]
    expect(buildObject(blocks)).toEqual({ name: 'John' })
  })

  test('nested object', () => {
    const blocks = [
      { type: 'keyvalue', key: 'user', value: '', indent: 0 },
      { type: 'keyvalue', key: 'name', value: 'John', indent: 2 },
      { type: 'keyvalue', key: 'age', value: '30', indent: 2 }
    ]
    expect(buildObject(blocks)).toEqual({ user: { name: 'John', age: 30 } })
  })

  test('simple array', () => {
    const blocks = [
      { type: 'keyvalue', key: 'items', value: '', indent: 0 },
      { type: 'arrayitem', value: 'first', indent: 2 },
      { type: 'arrayitem', value: 'second', indent: 2 }
    ]
    expect(buildObject(blocks)).toEqual({ items: ['first', 'second'] })
  })

  test('array with objects', () => {
    const blocks = [
      { type: 'keyvalue', key: 'users', value: '', indent: 0 },
      { type: 'arrayitem', key: 'name', value: 'John', indent: 2 },
      { type: 'keyvalue', key: 'age', value: '30', indent: 4 },
      { type: 'arrayitem', key: 'name', value: 'Jane', indent: 2 }
    ]
    expect(buildObject(blocks)).toEqual({
      users: [
        { name: 'John', age: 30 },
        { name: 'Jane' }
      ]
    })
  })

  test('multiline string', () => {
    const blocks = [
      { type: 'keyvalue', key: 'description', value: '', indent: 0 },
      { type: 'multiline', value: 'Line one', indent: 2 },
      { type: 'multiline', value: 'Line two', indent: 2 }
    ]
    expect(buildObject(blocks)).toEqual({ description: 'Line one\nLine two' })
  })

  test('inline array', () => {
    const blocks = [{ type: 'keyvalue', key: 'tags', value: '[one, two, three]', indent: 0 }]
    expect(buildObject(blocks)).toEqual({ tags: ['one', 'two', 'three'] })
  })

  test('empty value', () => {
    const blocks = [{ type: 'keyvalue', key: 'empty', value: '', indent: 0 }]
    expect(buildObject(blocks)).toEqual({ empty: null })
  })

  test('mixed types', () => {
    const blocks = [
      { type: 'keyvalue', key: 'string', value: 'hello', indent: 0 },
      { type: 'keyvalue', key: 'number', value: '42', indent: 0 },
      { type: 'keyvalue', key: 'boolean', value: 'true', indent: 0 }
    ]
    expect(buildObject(blocks)).toEqual({
      string: 'hello',
      number: 42,
      boolean: true
    })
  })

  test('complex nesting', () => {
    const blocks = [
      { type: 'keyvalue', key: 'app', value: '', indent: 0 },
      { type: 'keyvalue', key: 'name', value: 'Test', indent: 2 },
      { type: 'keyvalue', key: 'servers', value: '', indent: 2 },
      { type: 'arrayitem', key: 'name', value: 'web-01', indent: 4 },
      { type: 'keyvalue', key: 'ip', value: '1.1.1.1', indent: 6 }
    ]
    expect(buildObject(blocks)).toEqual({
      app: {
        name: 'Test',
        servers: [
          { name: 'web-01', ip: '1.1.1.1' }
        ]
      }
    })
  })
})
// Integration tests
describe('parseYAML', () => {
  test('simple object', () => {
    const input = `name: John
age: 30`
    expect(parseYAML(input)).toEqual({ name: 'John', age: 30 })
  })
  
  test('nested object', () => {
    const input = `user:
  name: John
  age: 30`
    expect(parseYAML(input)).toEqual({
      user: { name: 'John', age: 30 } 
    })
  })
  
  test('inline array', () => {
    const input = `tags: [frontend, javascript]`
    expect(parseYAML(input)).toEqual({ tags: ['frontend', 'javascript'] })
  })
  
  test('block array', () => {
    const input = `items:
  - first
  - second`
    expect(parseYAML(input)).toEqual({ items: ['first', 'second'] })
  })
  
  test('multiline string', () => {
    const input = `description:
  This is a multi-line
  string that preserves
  line breaks`
    expect(parseYAML(input)).toEqual({
      description: 'This is a multi-line\nstring that preserves\nline breaks' 
    })
  })
  
  test('comments', () => {
    const input = `# Comment
name: John # Another comment
age: 30`
    expect(parseYAML(input)).toEqual({ name: 'John', age: 30 })
  })
  
  test('empty values', () => {
    const input = `name: John
description:
age: 30`
    expect(parseYAML(input)).toEqual({
      name: 'John', 
      description: null, 
      age: 30 
    })
  })
  
  test('all types', () => {
    const input = `string: hello
number: 42
decimal: 3.14
boolean: true
date: 2024-01-15
array: [one, two, three]
empty:`
    expect(parseYAML(input)).toEqual({
      string: 'hello',
      number: 42,
      decimal: 3.14,
      boolean: true,
      date: new Date('2024-01-15'),
      array: ['one', 'two', 'three'],
      empty: null
    })
  })
  
  test('complex structure', () => {
    const input = `app:
  name: My App
  version: 1.0.0
  features: [auth, cache]
  
database:
  host: localhost
  port: 5432
  
servers:
  - name: web-01
    ip: 192.168.1.1
  - name: web-02
    ip: 192.168.1.2`
    
    expect(parseYAML(input)).toEqual({
      app: {
        name: 'My App',
        version: '1.0.0',
        features: ['auth', 'cache']
      },
      database: {
        host: 'localhost',
        port: 5432
      },
      servers: [
        { name: 'web-01', ip: '192.168.1.1' },
        { name: 'web-02', ip: '192.168.1.2' }
      ]
    })
  })
  
})