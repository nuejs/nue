
import { parsePage, parseImports } from '../src/compiler/page.js'


test('minimal', () => {
  const page = parsePage(' <foo/>')
  expect(page.tags[0].tag).toEqual('foo')
})

test('imports', () => {
  const page = parsePage(`
    <script>
      import { hello } from 'hello.js'
    </script>

    <a :class="hello" :onclick="hello">\${ hello() }</a>
  `)
  const [ tag ] = page.tags
  expect(tag.attr[0].fn).toBe('hello')
  expect(tag.handlers[0].h_fn).toBe('hello($e)')
  expect(tag.children[0].fn).toBe('hello()')
})

test('meta', () => {
  const page = parsePage(`
    <!-- @license MIT -->
    <script>
      import { hello } from 'hello.js'
    </script>
  `)
  expect(page.meta.license).toBe('MIT')
})


test('full', () => {
  const page = parsePage(`
    <!-- @spa -->
    <!doctype dhtml>

    <script>
      import { getContacts } from '/@system/model.js'
    </script>

    <!-- @reactive -->
    <custom>
      <script>this.foo = 10</script>
    </custom>

    <!-- @author tipiirai -->
    <another>
      <p>World</p>
    </another>

    <script>
      import { foo as state } from './foo.js'
    </script>
  `)

  expect(page.doctype).toEqual('dhtml')

  // meta
  const [a, b] = page.tags
  expect(page.meta).toEqual({ spa: true })
  expect(a.meta).toEqual({ reactive: true })
  expect(b.meta).toEqual({ author: 'tipiirai' })

  // script
  expect(page.script).toInclude('model.js')
  expect(page.script).toInclude('foo.js')

})


test('parseImports', () => {
  const template = `
    import { getContacts } from '/@system/model.js'
    import { foo as state } from './foo.js'
    // import { nothing } from './nothing.js'

    const { foo } = await import('/kama')
  `
  expect(parseImports(template)).toEqual(['getContacts', 'state'])
})







