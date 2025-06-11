
// compiler.test.js
import { convertFns, convertFn, compileTemplate, parseTemplate } from '../src/compiler'
import { inspect } from 'node:util'

test('convertFn', () => {
  expect(convertFn('_.foo')).toBe('_=>_.foo')
  expect(convertFn('_.foo + 1')).toBe('_=>(_.foo + 1)')
  expect(convertFn('_.foo', true)).toBe('(_,$e)=>_.foo($e)')
  expect(convertFn('i++; log(1)', true)).toBe('(_,$e)=>{i++; log(1)}')
  expect(convertFn('log(1)', true)).toBe('(_,$e)=>log(1)')
})

test('parseTemplate', () => {
  const template = '<div>Hello</div>'
  const [impl] = parseTemplate(template)
  expect(impl).toEqual({ tag: "div", children: [{text: "Hello" } ]})
})

test('<script> block', () => {
  const js = compileTemplate(`
    <a>
      \${ val }
      <script>
        this.val = 110

        this.setup = function() {
          return "done"
        }
      </script>
    </a>
  `)

  expect(js).toInclude('script: function()')
  expect(js).toInclude('_=>_.val')
})


test('empty template', () => {
  const template = ''
  const js = compileTemplate(template)
  expect(js).toContain('export const lib = []')
})

test('compileTemplate', () => {
  const template = '<p>Hello</p>'
  const js = compileTemplate(template)
  expect(js).toStartWith('export const lib = [')
})


test('multiple components', () => {
  const template = `
    <comp1>\${ fn(1) }</comp1>
    <comp2>\${ fn(2) }</comp2>
  `
  const js = compileTemplate(template)
  expect(js).toContain("tag: 'comp1'")
  expect(js).toContain("tag: 'comp2'")
})

test('function', () => {
  const js = compileTemplate('<b>${ fn(2) }</b>')
  expect(js).toInclude('fn: _=>(_.fn(2))')
})

test('quoted function', () => {
  const js = compileTemplate(`<b>\${ 'foo' + "bar" }</b>`)
  expect(js).toInclude(`=>('foo' + "bar")`)
})

test('script blocks', () => {
  const template = `
    <script>
      import { format } from './utils.js'
    </script>
    <script>
      function pretty() { }
    </script>
    <time is="pretty-date">\${ format(date) }</time>
  `
  const js = compileTemplate(template)
  expect(js).toContain('import { format }')
  expect(js).toContain('pretty() { }')
  expect(js).toContain('export const lib =')
})





