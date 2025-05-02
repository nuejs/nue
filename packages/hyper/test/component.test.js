
import { renderTemplate } from '../src'

test('self-closing', () => {
  const template = `<foo/>`
  const html = renderTemplate(template)
  expect(html).toBe('<div></div>')
})

test('render', () => {
  const template = '<hey/> <hey>Hello</hey>'
  const html = renderTemplate(template)
  expect(html).toBe('<div>Hello</div>')
})

test('child', () => {
  const template = '<a><hey/></a> <hey>Hello</hey>'
  const html = renderTemplate(template)
  expect(html).toBe('<a><div>Hello</div></a>')
})


test(':is=name', () => {
  const template = '<hey/> <a :is="hey">Hello</a>'
  const html = renderTemplate(template)
  expect(html).toBe('<a>Hello</a>')
})

test('params', () => {
  const template = `<hey text="foo" :text="'bar'"/> <hey>\${ text }</hey>`
  const html = renderTemplate(template)
  expect(html).toBe('<div text="foo">bar</div>')
})

test('child data', () => {
  const template = `
    <figure>
      <bar-chart :hey="rand()" :value/>
      <script>
        this.value = 100
        rand() { return ['hey'] }
      </script>
    </figure>
    <bar-chart>\${ hey[0] } \${ value }</bar-chart>
  `
  expect(renderTemplate(template)).toInclude('<div>hey 100</div>')
})

test('script', () => {
  const template = `
    <hey/>
    <hey>
      \${ text }
      <script>
        this.text = 'Hello'
      </script>
    </hey>
  `
  const html = renderTemplate(template)
  expect(html).toBe('<div>Hello</div>')
})

test('loop', () => {
  const template = `
    <ul>
      <item :for="text of arr" :text="\${ text }"/>
      <script>
        this.arr = ['hello', 'world']
      </script>
    </ul>

    <li :is="item">\${ text }</li>
  `
  const html = renderTemplate(template)
  expect(html).toBe('<ul><li>hello</li><li>world</li></ul>')
})

test('if-else', () => {
  const template = `
    <div>
      <item :if="ok"/>
      <bar :else/>
    </div>

    <item>Fail</item>
    <p :is="bar">Else</p>
  `
  const html = renderTemplate(template)
  expect(html).toBe('<div><p>Else</p></div>')
})

test('parent & child params', () => {
  const template = `
    <item :amount="2"/>
    <item class="bar" data-amount="\${ amount }"/>
  `
  const html = renderTemplate(template)
  expect(html).toBe('<div class="bar" data-amount="2"></div>')
})

test('class merging', () => {
  const template = `
    <item class="bar"/>
    <item class="foo">
      <img class="nested">
    </item>
  `
  const html = renderTemplate(template)
  expect(html).toBe('<div class="foo bar"><img class="nested"></div>')
})

test(':bind', () => {
  const template = `
    <item :bind="\${ data }"/>
    <item><h1>\${title}</h1><p>\${ desc }</p></item>
  `
  const data = { title: 'Hello', desc: 'World' }
  const html = renderTemplate(template, { data })
  expect(html).toBe('<div><h1>Hello</h1> <p>World</p></div>')
})

test(':bind="foo', () => {
  const html = renderTemplate(`
    <div>
      <item :bind="\${ this }"/>
      <script>
        this.title = 'Hello'
        this.desc = 'World'
      </script>
    </div>
    <item>
      <h1>\${title}</h1>
      <p>\${ desc }</p>
    </item>
  `)
  expect(html).toInclude('<h1>Hello</h1> <p>World</p>')
})


test('slot', () => {
  const template = `
    <item :hey="\${ title }">
      <p>\${ desc }</p>
      <small>yo</small>
      \${ desc }
    </item>

    <item>
      <h1>\${ hey }</h1>
      <slot/>
    </item>
  `
  const html = renderTemplate(template, { title: 'Hello', desc: 'World' })
  expect(html).toBe('<div><h1>Hello</h1><p>World</p> <small>yo</small>World</div>')
})


test('slot loop', () => {
  const html = renderTemplate(`
    <a>
      <child :for="el, i in new Array(2).fill(1)">\${i}</child>
    </a>
    <b :is="child">i: <slot/></b>
  `)
  expect(html).toBe('<a><b>i: 0</b><b>i: 1</b></a>')
})


test('mount attribute', () => {
  const template = `
    <a :mount="\${ type }" :key="\${ id }"/>

    <item href="id:\${ key }">
      <b>Hello</b>
    </item>
  `
  const html = renderTemplate(template, { type: 'item', id: 1 })
  expect(html).toBe('<a href="id:1"><b>Hello</b></a>')
})

test('onmount mounted callbacks', () => {
  jest.spyOn(console, 'info').mockImplementation(() => {})

  const html = renderTemplate(`
    <a><inner/></a>

    <b :is="inner">
      <script>
        onmount() { this.val = 'ok' }
        mounted() { console.info(this.val) }
      </script>
    </b>
  `)
  expect(console.info).toHaveBeenCalledWith('ok')
})



