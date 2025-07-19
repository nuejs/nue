
import { renderNue } from '../src/dom/render.js'

test('self-closing', () => {
  expect(renderNue('<a/>')).toBe('<a></a>')
})

test('render', () => {
  expect(renderNue('<hey/><hey>Hello</hey>')).toBe('<div>Hello</div>')
})

test('child', () => {
  const html = renderNue('<a><hey/></a> <hey>Hello</hey>')
  expect(html).toBe('<a><div>Hello</div></a>')
})


test(':is=name', () => {
  const html = renderNue('<hey/> <a :is="hey">Hello</a>')
  expect(html).toBe('<a>Hello</a>')
})

test('params', () => {
  const html = renderNue(`<hey text="foo" :text="'bar'"/> <hey>\${ text }</hey>`)
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
  expect(renderNue(template)).toInclude('<div>hey 100</div>')
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
  const html = renderNue(template)
  expect(html).toBe('<div>Hello</div>')
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
  const html = renderNue(template)
  expect(html).toBe('<div><p>Else</p></div>')
})

test('parent & child params', () => {
  const template = `
    <item :amount="2"/>
    <item class="bar" data-amount="\${ amount }"/>
  `
  const html = renderNue(template)
  expect(html).toBe('<div class="bar" data-amount="2"></div>')
})

test('class merging', () => {
  const template = `
    <item class="bar"/>
    <item class="foo">
      <img class="nested">
    </item>
  `
  const html = renderNue(template)
  expect(html).toBe('<div class="foo bar"><img class="nested"></div>')
})

test(':bind', () => {
  const template = `
    <item :bind="\${ data }"/>
    <item><h1>\${title}</h1><p>\${ desc }</p></item>
  `
  const data = { title: 'Hello', desc: 'World' }
  const html = renderNue(template, { data: { data } })
  expect(html).toBe('<div><h1>Hello</h1> <p>World</p></div>')
})

test(':bind this', () => {
  const html = renderNue(`
    <div>
      <item :bind="\${ this }"/>
      <script>
        this.title = 'Hello'
        this.desc = 'World'
      </script>
    </div>
    <item>
      <h1>\${ title }</h1>
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
  const html = renderNue(template, { data: { title: 'Hello', desc: 'World' } })
  expect(html).toBe('<div><h1>Hello</h1><p>World</p> <small>yo</small>World</div>')
})


test('mount attribute', () => {
  const template = `
    <a :mount="type" :key="id"/>

    <item href="id:\${ key }">
      <b>Hello</b>
    </item>
  `
  const html = renderNue(template, { data: { type: 'item', id: 1 } })
  expect(html).toBe('<a href="id:1"><b>Hello</b></a>')
})

test('<template :mount>', () => {
  const template = `
    <template mount="item"/>
    <item>
      <b>Hello</b>
    </item>
  `
  const html = renderNue(template)
  expect(html).toBe('<div><b>Hello</b></div>')
})





