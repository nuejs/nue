export function stripComments(line) {
  if (line.trim().startsWith('#')) return ''
  const match = line.match(/\s#\s/)
  return match ? line.substring(0, match.index) : line
}

export function measureIndent(line) {
  let indent = 0
  for (let char of line) {
    if (char == ' ') indent++
    else break
  }
  return indent
}

export function detectIndentSize(lines) {
  for (let line of lines) {
    const stripped = stripComments(line)
    if (stripped.trim() == '') continue
    const indent = measureIndent(stripped)
    if (indent > 0) return indent
  }
  return 2
}

export function validateIndentation(lines) {
  for (let i = 0; i < lines.length; i++) {
    const line = stripComments(lines[i])
    const leadingWhitespace = line.match(/^[\s]*/)[0]
    if (leadingWhitespace.includes('\t')) {
      throw new Error(`Tabs not allowed for indentation. Use spaces only. Line ${i + 1}`)
    }
  }

  const indentSize = detectIndentSize(lines)
  const indentLevels = new Set()

  for (let line of lines) {
    const stripped = stripComments(line)
    if (stripped.trim() == '') continue
    const indent = measureIndent(stripped)
    if (indent > 0) indentLevels.add(indent)
  }

  for (let level of indentLevels) {
    if (level % indentSize != 0) {
      throw new Error(`Inconsistent indentation. Expected multiples of ${indentSize} spaces.`)
    }
  }

  return indentSize
}

export function isNumber(str) {
  if (str == '' || str == '-' || str == '+' || str[0] == '0') return false
  return /^-?\d+(\.\d+)?$/.test(str)
}

export function parseValue(raw) {
  const val = raw.trim()

  if (val == '') return null
  if (val == 'true') return true
  if (val == 'false') return false
  if (isNumber(val)) return parseFloat(val)

  if ((val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }

  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z)?$/.test(val)) {
    return new Date(val)
  }

  return val
}

export function parseYAMLArray(line) {
  const match = line?.match(/^\s*\w+\s*:\s*\[(.*)\]$/)
  if (!match) return null
  if (match[1].trim() == '') return []
  return match[1].split(',').map(item => parseValue(item))
}

export function detectStructure(lines) {
  const blocks = []

  for (let i = 0; i < lines.length; i++) {
    const line = stripComments(lines[i])
    const trimmed = line.trim()
    if (trimmed == '') continue

    const indent = measureIndent(line)

    // Array item
    if (trimmed.startsWith('- ')) {
      const content = trimmed.slice(2).trim()
      const colonIndex = content.indexOf(': ')

      if (colonIndex > 0) {
        blocks.push({
          type: 'arrayitem',
          key: content.slice(0, colonIndex),
          value: content.slice(colonIndex + 2),
          indent,
          lineIndex: i
        })
      } else {
        blocks.push({
          type: 'arrayitem',
          value: content,
          indent,
          lineIndex: i
        })
      }
      continue
    }

    // Key-value pair
    const colonSpaceIndex = trimmed.indexOf(': ')
    const colonIndex = trimmed.indexOf(':')

    if (colonIndex > 0) {
      const useSpace = colonSpaceIndex > 0
      const splitIndex = useSpace ? colonSpaceIndex : colonIndex
      const offset = useSpace ? 2 : 1

      blocks.push({
        type: 'keyvalue',
        key: trimmed.slice(0, splitIndex),
        value: trimmed.slice(splitIndex + offset),
        indent,
        lineIndex: i
      })
      continue
    }

    // Multi-line continuation
    blocks.push({
      type: 'multiline',
      value: trimmed,
      indent,
      lineIndex: i
    })
  }

  return blocks
}

// get children at next indent level
function getChildren(blocks, start, parentIndent) {
  const children = []
  let i = start

  while (i < blocks.length && blocks[i].indent > parentIndent) {
    children.push({ ...blocks[i], originalIndex: i })
    i++
  }

  return children
}

// build array from array item blocks
function buildArray(blocks, baseIndent) {
  const result = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    // only process items at this indent level
    if (block.type != 'arrayitem' || block.indent != baseIndent) {
      i++
      continue
    }

    // get nested content for this array item
    const nested = []
    let j = i + 1
    while (j < blocks.length && blocks[j].indent > baseIndent) {
      nested.push(blocks[j])
      j++
    }

    if ('key' in block) {
      // array item with key: - name: value
      const obj = {}
      const inlineArray = parseYAMLArray(block.key + ': ' + block.value)
      obj[block.key] = inlineArray ?? parseValue(block.value)

      // add nested properties
      if (nested.length > 0) {
        const nestedObj = buildValue(nested, baseIndent + 2)
        if (typeof nestedObj == 'object' && !Array.isArray(nestedObj)) {
          Object.assign(obj, nestedObj)
        }
      }

      result.push(obj)
    } else {
      // simple array item: - value
      if (nested.length > 0 && nested[0].type == 'arrayitem') {
        // nested array under simple value
        const nestedArray = buildArray(nested, nested[0].indent)
        result.push({ value: block.value, items: nestedArray })
      } else if (nested.length > 0) {
        // nested object under simple value
        const nestedObj = buildValue(nested, baseIndent + 2)
        result.push({ value: block.value, ...nestedObj })
      } else {
        result.push(parseValue(block.value))
      }
    }

    i = j
  }

  return result
}

// build value from child blocks
function buildValue(children, parentIndent) {
  if (children.length == 0) return null

  const first = children[0]

  // multiline string
  if (first.type == 'multiline') {
    return children.map(c => c.value).join('\n')
  }

  // array
  if (first.type == 'arrayitem') {
    return buildArray(children, first.indent)
  }

  // nested object
  return buildObject(children)
}

export function buildObject(blocks) {
  const result = {}
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type != 'keyvalue') {
      i++
      continue
    }

    const children = getChildren(blocks, i + 1, block.indent)

    if (block.value != '') {
      // inline value or array
      const inlineArray = parseYAMLArray(block.key + ': ' + block.value)
      result[block.key] = inlineArray ?? parseValue(block.value)
    } else if (children.length > 0) {
      // nested content
      result[block.key] = buildValue(children, block.indent)
    } else {
      result[block.key] = null
    }

    i += 1 + children.length
  }

  return result
}

export function parseYAML(text) {
  const lines = text.split('\n')
  validateIndentation(lines)
  const blocks = detectStructure(lines)
  return buildObject(blocks)
}