
export function stripComments(line) {
  // Full line comment
  if (line.trim().startsWith('#')) return ''

  // Inline comment (# preceded by whitespace)
  const match = line.match(/\s#/)
  if (!match) return line
  return line.substring(0, match.index)
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
  return 2 // default to 2 spaces
}

export function validateIndentation(lines) {
  // Check for tabs in indentation (beginning of line only)
  for (let i = 0; i < lines.length; i++) {
    const line = stripComments(lines[i])
    const leadingWhitespace = line.match(/^[\s]*/)[0]
    if (leadingWhitespace.includes('\t')) {
      throw new Error(`Tabs not allowed for indentation. Use spaces only. Line ${i + 1}`)
    }
  }

  const indentSize = detectIndentSize(lines)
  const indentLevels = new Set()

  for (let i = 0; i < lines.length; i++) {
    const line = stripComments(lines[i])
    if (line.trim() == '') continue

    const indent = measureIndent(line)
    if (indent > 0) {
      indentLevels.add(indent)
    }
  }

  // Check that all indentation levels are multiples of the base indent size
  for (let level of indentLevels) {
    if (level % indentSize != 0) {
      throw new Error(`Inconsistent indentation. Expected multiples of ${indentSize} spaces.`)
    }
  }

  return indentSize
}

export function isNumber(str) {
  if (str == '' || str == '-' || str == '+') return false
  return /^-?\d+(\.\d+)?$/.test(str)
}

export function parseValue(raw) {
  const val = raw.trim()

  if (val == '') return null
  if (val == 'true') return true
  if (val == 'false') return false
  if (isNumber(val)) return parseFloat(val)

  // Unwrap quoted strings
  if ((val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }

  // ISO date format
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z)?$/.test(val)) {
    return new Date(val)
  }

  return val
}

export function parseArrayItems(line) {
  const match = line?.match(/\[(.*)\]/)
  if (!match) return null

  if (match[1].trim() == '') return []

  const items = match[1].split(',').map(item => parseValue(item))
  return items
}

export function detectStructure(lines) {
  const blocks = []

  for (let i = 0; i < lines.length; i++) {
    const line = stripComments(lines[i])
    const trimmed = line.trim()

    if (trimmed == '') continue

    const indent = measureIndent(line)

    // Check for array item first
    if (trimmed.startsWith('- ')) {
      const content = trimmed.slice(2).trim()
      const colonIndex = content.indexOf(': ')

      if (colonIndex > 0) {
        // Array item with key-value: - key: value
        blocks.push({
          type: 'arrayitem',
          key: content.slice(0, colonIndex),
          value: content.slice(colonIndex + 2),
          indent,
          lineIndex: i
        })
      } else {
        // Simple array item: - value
        blocks.push({
          type: 'arrayitem',
          value: parseValue(content),
          indent,
          lineIndex: i
        })
      }
      continue
    }

    // Check for key-value pair
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

    // Multi-line string continuation
    blocks.push({
      type: 'multiline',
      value: trimmed,
      indent,
      lineIndex: i
    })
  }

  return blocks
}

export function buildObject(blocks) {
  const result = {}
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type == 'keyvalue') {
      let value

      // Check for inline array
      if (block.value != '') {
        const arrayItems = parseArrayItems(block.key + ': ' + block.value)
        if (arrayItems) {
          value = arrayItems
        } else {
          value = parseValue(block.value)
        }
      } else {
        // Look ahead for children
        const children = []
        let j = i + 1

        while (j < blocks.length && blocks[j].indent > block.indent) {
          children.push(blocks[j])
          j++
        }

        if (children.length > 0) {
          // Check if first child is array item
          if (children[0].type == 'arrayitem') {
            value = []
            let k = 0

            while (k < children.length) {
              const child = children[k]

              if (child.type == 'arrayitem' && child.indent == children[0].indent) {
                // Check if array item has a key (object) or just a value
                if ('key' in child) {
                  // Array item with object content: - name: value
                  const itemObj = {}
                  itemObj[child.key] = parseValue(child.value)

                  // Look for additional properties of this array item
                  let m = k + 1
                  while (m < children.length && children[m].indent > child.indent) {
                    if (children[m].type == 'keyvalue') {
                      itemObj[children[m].key] = parseValue(children[m].value)
                    }
                    m++
                  }

                  value.push(itemObj)
                  k = m
                } else {
                  // Simple array item: - value
                  value.push(child.value)
                  k++
                }
              } else {
                k++
              }
            }
          }
          // Check if first child is multiline
          else if (children[0].type == 'multiline') {
            value = children.map(c => c.value).join('\n')
          }
          // Otherwise it's a nested object
          else {
            value = buildObject(children)
          }

          i = j - 1 // Skip processed children
        } else {
          value = null
        }
      }

      result[block.key] = value
    }

    i++
  }

  return result
}

export function parseYAML(text) {
  const lines = text.split('\n')
  validateIndentation(lines)
  const blocks = detectStructure(lines)
  return buildObject(blocks)
}