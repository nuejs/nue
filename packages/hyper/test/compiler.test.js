
import { toFunction, compileTemplate, parseTemplate, parseImports } from '../src/compiler/index.js'


test('toFunction', () => {
  expect(toFunction('_.foo')).toBe('_=>_.foo')
  expect(toFunction('_.foo + 1')).toBe('_=>(_.foo + 1)')
  expect(toFunction('_.foo', true)).toBe('(_,$e)=>_.foo($e)')
  expect(toFunction('i++; log(1)', true)).toBe('(_,$e)=>{i++; log(1)}')
  expect(toFunction('log(1)', true)).toBe('(_,$e)=>log(1)')
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

test.only('script blocks', () => {
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
  console.info(js)
  expect(js).toContain('import { format }')
  expect(js).toContain('pretty() { }')
  expect(js).toContain('export const lib =')
})

test('parseImports', () => {
  const template = `
    import { getContacts } from '/@system/model.js'
    import { foo as state } from './foo.js'
    // import { nothing } from './nothing.js'

    const { foo } = await import('/kama')
  `
  expect(parseImports(template)).toBe('const imports = { getContacts, state }')
})






