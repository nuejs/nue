
import { parseFor, parseClass, setContext, setContextTo, parseExpr } from '../src/expr.js'


// helper function to run multiple tests at once
function runTests(fn, tests) {
  Object.keys(tests).slice(0, 100).forEach(key => {
    const val = fn(key)
    // console.info(val)
    expect(val).toEqual(tests[key])
  })
}

test('For loop expression', () => {
  runTests(parseFor, {
    'el in items': [ "el", "_.items", "$index" ],
    'el, i of cat.items': [ "el", "_.cat.items", "i" ],
    '{ name, age } in items': [[ "name", "age" ], "_.items", "$index"],
    '({ name, age }) in items': [[ "name", "age" ], "_.items", "$index"],
    '({ name, age } , $i) in items': [[ "name", "age" ], "_.items", "$i"],
    '[ name, age, $i ] in entries': [[ "name", "age" ], "_.entries", "$i", true],
  })
})

test('Class attributes', () => {
  runTests(parseClass, {
    'active: foo && Date.now()': [ "_.foo && Date.now() && 'active '" ],

    'is-active: isActive, danger: hasError()':
      [ "_.isActive && 'is-active '", "_.hasError() && 'danger '" ],
  })
})

test('Context (_.variable)', () => {
  runTests(setContext, {
    'foo': '_.foo',
    "foo + 'yo foo'" : "_.foo + 'yo foo'",
    'a/b + !foo': '_.a/_.b + !_.foo',
    'location.href': 'location.href',
    '$foo + _bar + baz/5': '_.$foo + _._bar + _.baz/5',
  })
})


test('Expressions', () => {

  runTests(parseExpr, {
    'Hey { name }': [ "'Hey '", '_.name' ],
    "Hey, I'm { name }": [ '"Hey, I\'m "', '_.name' ],
    'foo { alarm } is-alert': [ "'foo '", '_.alarm', "' is-alert'" ],
    'is-cool { danger: hasError }': [ "'is-cool '", "_.hasError && 'danger '" ],

    '{ is-active: isActive } is-cool { danger: hasError }': [
      "_.isActive && 'is-active '",
      "' is-cool '",
      "_.hasError && 'danger '"
    ]
  })
})



