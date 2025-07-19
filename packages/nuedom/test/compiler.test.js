
import { compileNue, compileFn } from '../src/compiler/compiler.js'


test('empty template', () => {
  const js = compileNue('')
  expect(js).toContain('export const lib = []')
})

test('compileNue', () => {
  const template = '<p>Hello</p>'
  const js = compileNue(template)
  expect(js).toStartWith('export const lib = [')
})


test('multiple components', () => {
  const template = `
    <comp1>\${ fn(1) }</comp1>
    <comp2>\${ fn(2) }</comp2>
  `
  const js = compileNue(template)
  expect(js).toContain("tag: 'comp1'")
  expect(js).toContain("tag: 'comp2'")
})

test('function', () => {
  const js = compileNue('<b>${ fn(2) }</b>')
  expect(js).toInclude('fn: _=>(_.fn(2))')
})

test('quoted function', () => {
  const js = compileNue(`<b>\${ 'foo' + "bar" }</b>`)
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
  const js = compileNue(template)
  expect(js).toContain('import { format }')
  expect(js).toContain('pretty() { }')
  expect(js).toContain('export const lib =')
})

test('<script> block', () => {
  const js = compileNue(`
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


test('compileFn', () => {
  expect(compileFn('_.foo')).toBe('_=>_.foo')
  expect(compileFn('_.foo + 1')).toBe('_=>(_.foo + 1)')
  expect(compileFn('_.foo', true)).toBe('(_,$e)=>_.foo($e)')
  expect(compileFn('i++; log(1)', true)).toBe('(_,$e)=>{i++; log(1)}')
  expect(compileFn('log(1)', true)).toBe('(_,$e)=>log(1)')
})

