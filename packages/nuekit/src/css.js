
export function minifyCSS(str) {
  return parseCSS(str).map(serialize).join('')
}

export function parseCSS(str) {
  const tokens = tokenize(str)
  let i = 0
  const nodes = []

  function parseRule() {
    const node = { name: '', props: [], children: [] }

    // Check for top-level comment
    if (i < tokens.length && tokens[i].type == 'comment') {
      node.comment = tokens[i].value
      i++
    }

    // Selector
    if (i < tokens.length && tokens[i].type == 'text') {
      node.name = tokens[i].value
      i++
    }

    // Opening brace
    if (i < tokens.length && tokens[i].type == 'open-brace') {
      i++

      // Parse contents
      while (i < tokens.length && tokens[i].type != 'close-brace') {
        if (tokens[i].type == 'text') {
          // Check if it's a property or nested selector
          if (i + 1 < tokens.length && tokens[i + 1].type == 'colon') {
            // Property declaration
            const property = tokens[i].value
            i += 2 // skip text and colon

            const value = tokens[i].value
            i++ // skip value

            node.props.push({ name: property, value })

            // Skip semicolon if present
            if (i < tokens.length && tokens[i].type == 'semicolon') {
              i++
            }
          } else {
            // Nested selector - recursively parse
            const child = parseRule()
            node.children.push(child)
          }
        } else {
          i++ // skip unexpected tokens
        }
      }

      // Closing brace
      if (i < tokens.length && tokens[i].type == 'close-brace') {
        i++
      }
    }

    return node
  }

  while (i < tokens.length) {
    const node = parseRule()
    if (node.name || node.comment) {
      nodes.push(node)
    }
  }

  return nodes
}


function serialize(node) {
  let result = ''

  if (node.name) {
    result += node.name + '{'

    // Add properties
    if (node.props.length > 0) {
      result += node.props.map(prop => prop.name + ':' + prop.value).join(';')

      // Add semicolon after props if there are children
      if (node.children.length > 0) {
        result += ';'
      }
    }

    // Add children
    result += node.children.map(serialize).join('')

    result += '}'
  }

  return result
}


export function tokenize(css) {
  const tokens = []
  let i = 0

  while (i < css.length) {
    const char = css[i]

    if (/\s/.test(char)) {
      i++
      continue
    }

    if (char == '/' && css[i + 1] == '*') {
      const start = i
      i += 2
      while (i < css.length && !(css[i] == '*' && css[i + 1] == '/')) {
        i++
      }
      i += 2
      tokens.push({ type: 'comment', value: css.slice(start, i) })
      continue
    }

    if (char == '{') {
      tokens.push({ type: 'open-brace', value: char })
      i++
      continue
    }

    if (char == '}') {
      tokens.push({ type: 'close-brace', value: char })
      i++
      continue
    }

    if (char == ';') {
      tokens.push({ type: 'semicolon', value: char })
      i++
      continue
    }

    if (char == ':') {
      tokens.push({ type: 'colon', value: char })
      i++
      continue
    }

    // Text token
    const { value, end } = readTextToken(css, i)
    if (value) {
      tokens.push({ type: 'text', value })
    }
    i = end
  }
  
  return tokens
}

function readTextToken(css, start) {
  let i = start

  while (i < css.length) {
    const char = css[i]

    // Stop at structural characters
    if (char == '{' || char == '}' || char == ';') break
    if (char == '/' && css[i + 1] == '*') break

    // For colon, check if it's a property declaration
    if (char == ':') {
      // Look ahead for semicolon or closing brace
      let j = i + 1
      while (j < css.length && css[j] != '{' && css[j] != ';' && css[j] != '}') {
        j++
      }

      // If we found ; or }, this colon starts a property value
      if (j < css.length && (css[j] == ';' || css[j] == '}')) {
        break
      }
    }

    i++
  }

  return { value: css.slice(start, i).trim(), end: i }
}
