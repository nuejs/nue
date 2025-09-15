
import { parseNue, parseNames } from '../src/compiler/document.js'

test('doctype & root', () => {
  const doc = parseNue('<!dhtml> <app/> <section :is="mod"/>')

  expect(doc).toMatchObject({
    root: { tag: "app", is_custom: true },
    doctype: "dhtml",
    is_dhtml: true,
    is_lib: true,
  })
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
    <?xml version="1.0">

    <!--
      @use [foo, bar]
    -->
    <svg></svg>
  `)
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
      import { getContacts } from '/@shared/model.js'
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

    import {foo as state, another } from 'foo.js'

    // import { nothing } from 'nothing.js'

    const { MEME, PRANK } = await import('/kama')

    const FOO = [ 100 ]

    export function format() {

    }

    function trick() {

    }
  `

  expect(parseNames(template)).toEqual([
   'getContacts', 'state', 'another', 'MEME', 'PRANK', 'FOO', 'format', 'trick'
  ])

})







