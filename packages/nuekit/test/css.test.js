
import { tokenize, parseCSS, minifyCSS } from '../src/tools/css'

describe('tokenizer', () => {

  test('comments', () => {
    const tokens = tokenize('/* header styles */')
    expect(tokens).toEqual([
      { type: 'comment', value: '/* header styles */' }
    ])
  })

  test('simple rule', () => {
    const tokens = tokenize('div { color: red; }')
    expect(tokens).toEqual([
      { type: 'text', value: 'div' },
      { type: 'open-brace', value: '{' },
      { type: 'text', value: 'color' },
      { type: 'colon', value: ':' },
      { type: 'text', value: 'red' },
      { type: 'semicolon', value: ';' },
      { type: 'close-brace', value: '}' }
    ])
  })

  test('nested rule', () => {
    const tokens = tokenize('.card { padding: 1rem; &:hover { color: blue; } }')
    expect(tokens).toEqual([
      { type: 'text', value: '.card' },
      { type: 'open-brace', value: '{' },
      { type: 'text', value: 'padding' },
      { type: 'colon', value: ':' },
      { type: 'text', value: '1rem' },
      { type: 'semicolon', value: ';' },
      { type: 'text', value: '&:hover' },
      { type: 'open-brace', value: '{' },
      { type: 'text', value: 'color' },
      { type: 'colon', value: ':' },
      { type: 'text', value: 'blue' },
      { type: 'semicolon', value: ';' },
      { type: 'close-brace', value: '}' },
      { type: 'close-brace', value: '}' }
    ])
  })

  test('complex selector', () => {
    const tokens = tokenize('.item:nth-child(2n+1):not(.hidden) { display: block; }')

    expect(tokens).toEqual([
      { type: 'text', value: '.item:nth-child(2n+1):not(.hidden)' },
      { type: 'open-brace', value: '{' },
      { type: 'text', value: 'display' },
      { type: 'colon', value: ':' },
      { type: 'text', value: 'block' },
      { type: 'semicolon', value: ';' },
      { type: 'close-brace', value: '}' }
    ])
  })

  test('@layer definition', () => {
    const tokens = tokenize('@layer base, component;')
    expect(tokens).toEqual([
      { type: "text", value: "@layer base, component" },
      { type: "semicolon", value: ";" }
    ])
  })

})

describe('parser', () => {
  test('simple rule', () => {
    const result = parseCSS('div { color: red; }')
    expect(result).toEqual([{
      name: 'div',
      props: [{ name: 'color', value: 'red' }],
      children: []
    }])
  })

  test('rule with comment', () => {
    const result = parseCSS('/* header styles */ .header { padding: 1rem; }')
    expect(result).toEqual([{
      name: '.header',
      comment: '/* header styles */',
      props: [{ name: 'padding', value: '1rem' }],
      children: []
    }])
  })

  test('nested rule', () => {
    const result = parseCSS('.card { padding: 1rem; &:hover { color: blue; } }')
    expect(result).toEqual([{
      name: '.card',
      props: [{ name: 'padding', value: '1rem' }],
      children: [{
        name: '&:hover',
        props: [{ name: 'color', value: 'blue' }],
        children: []
      }]
    }])
  })
})

describe('minify', () => {
  test('simple rule', () => {
    const result = minifyCSS('div { color: red; }')
    expect(result).toBe('div{color:red}')
  })

  test('strips whitespace', () => {
    const result = minifyCSS(`
      .header {
        padding: 1rem;
        margin: 0;
      }
    `)
    expect(result).toBe('.header{padding:1rem;margin:0}')
  })

  test('comment', () => {
    expect(minifyCSS('/* CSS */')).toBe('')
  })

  test(':root + @layer', () => {
    const css = minifyCSS('@layer base { :root { --brand: #ccc } }')
    expect(css).toBe('@layer base{:root{--brand:#ccc}}')
  })

  test(':root props', () => {
    const css = minifyCSS(':root { --brand: #ccc }')
    expect(css).toBe(':root{--brand:#ccc}')
  })

  test('strips comments', () => {
    const result = minifyCSS('/* header styles */ .header { padding: 1rem; }')
    expect(result).toBe('.header{padding:1rem}')
  })

  test('nested rules', () => {
    const result = minifyCSS('.card { padding: 1rem; &:hover { color: blue; } }')
    expect(result).toBe('.card{padding:1rem;&:hover{color:blue}}')
  })

  test('multiple rules', () => {
    const result = minifyCSS('div { color: red; } .box { width: 100px; }')
    expect(result).toBe('div{color:red}.box{width:100px}')
  })
})
