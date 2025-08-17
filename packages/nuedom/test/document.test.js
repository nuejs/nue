
import { parseNue, parseNames } from '../src/compiler/document.js'

test('minimal', () => {
  const { doctype, root } = parseNue('<!html+dhtml lib> <foo/>')
  expect(root.tag).toEqual('foo')
  expect(doctype).toBe('html+dhtml lib')
})

test('imports', () => {
  const page = parseNue(`
    <script>
      import { hello } from 'hello.js'
    </script>

    <a :class="hello" :onclick="hello">{ hello() }</a>
  `)


  const { root } = page
  expect(root.attr[0].fn).toBe('hello')
  expect(root.handlers[0].h_fn).toBe('hello($e)')
  expect(root.children[0].fn).toBe('hello()')
  expect(page.is_dhtml).toBeTrue()
})

test('meta', () => {
  const page = parseNue(`
    <!-- @license MIT -->
    <script>
      import { hello } from 'hello.js'
    </script>
  `)
  expect(page.meta.license).toBe('MIT')
})

test('svg document', () => {
  const page = parseNue(`
    <?xml version="1.0" standalone="no"?>

    <!--
      @use [foo, bar]
    -->
    <svg></svg>
  `)
  expect(page.standalone).toBeFalse()
  expect(page.lib[0]).toMatchObject({
    meta: { use: "[foo, bar]" },
    svg: true,
  })

})


test('full', () => {
  const page = parseNue(`
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
  const [a, b] = page.lib
  expect(page.meta).toEqual({ spa: true })
  expect(a.meta).toEqual({ reactive: true })
  expect(b.meta).toEqual({ author: 'tipiirai' })

  // script
  expect(page.script).toInclude('model.js')
  expect(page.script).toInclude('foo.js')

})


test('parseNames', () => {
  const template = `
    import { getContacts } from 'model.js'
    import { foo as state } from 'foo.js'
    // import { nothing } from 'nothing.js'

    const { MEME, PRANK } = await import('/kama')

    export function format() {

    }

    function trick() {

    }
  `
  expect(parseNames(template)).toEqual([
    "getContacts", "state", "MEME", "PRANK", "format", "trick"
  ])

})







