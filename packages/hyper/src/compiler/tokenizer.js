
import { SELF_CLOSING } from './html5.js'


export function tokenize(template) {
  const tokens = []
  let pos = 0

  while (pos < template.length) {
    const char = template[pos]
    if (char == '<' && template.slice(pos, pos + 4) == '<!--') {
      pos = parseComment(template, pos, tokens)
    } else if (char == '<') {
      if (template.slice(pos, pos + 7) == '<script') {
        pos = addScript(template, pos, tokens)
      } else {
        pos = addTag(template, pos, tokens)
      }
    } else if ('$#'.includes(char) && template[pos + 1] == '{') {
      pos = addExpr(template, pos, tokens)
    } else {
      pos = addText(template, pos, tokens)
    }
  }

  return tokens.filter(el => el.meta || el.trim())
}

function parseComment(template, pos, tokens) {
  const end = template.indexOf('-->', pos + 4)
  if (end == -1) throw new SyntaxError(`Unclosed comment at ${pos}`)

  // annotations
  const is_first = !template.slice(0, pos).trim()
  const meta = is_first && parseAnnotations(template.slice(pos + 4, end))
  if (meta) tokens.unshift({ meta })

  return end + 3
}


function parseAnnotations(comment) {
  const lines = comment.split('\n')
  const ret = {}
  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed[0] == '@') {
      const match = trimmed.match(/^@(\w+)(?:\s+(.+))?$/)
      if (match) {
        const [, key, value] = match
        ret[key] = value || true
      }
    }
  })
  return Object.keys(ret).length ? ret : null
}

function addTag(template, pos, tokens) {

  let i = pos + 1
  let quote = null
  while (i < template.length) {
    if ("'\"".includes(template[i]) && (i == 0 || template[i - 1] != '\\')) {
      quote = quote == null ? template[i] : null
    }
    if (template[i] == '>' && quote == null) {
      i++
      tokens.push(toSelfClosing(template.slice(pos, i)))
      return i
    }
    if (template[i] == '<' && i > pos && quote == null) {
      throwSyntaxError(pos, template.slice(pos, i + 10) + "...")
    }
    i++
  }
  throwSyntaxError(pos, template.slice(pos, pos + 10) + "...")
}


// <img>, <img src="a">
function toSelfClosing(tag) {
  let name = tag.slice(1, -1)
  const i = name.indexOf(' ')
  if (i > 0) name = name.slice(0, i)
  return SELF_CLOSING.includes(name) ? tag.slice(0, -1) + '/>' : tag
}

function addScript(template, pos, tokens) {
  const tagEnd = template.indexOf('>', pos)
  if (tagEnd == -1) throw new SyntaxError(`Unclosed script tag at ${pos}`)
  tokens.push(template.slice(pos, tagEnd + 1)) // Add <script> with attributes
  pos = tagEnd + 1

  const contentStart = pos
  const scriptEnd = template.indexOf('</script>', pos)
  if (scriptEnd == -1) throw new SyntaxError(`Missing </script>`)
  tokens.push(template.slice(contentStart, scriptEnd)) // Add script content as one token
  tokens.push('</script>')
  return scriptEnd + 9 // Move past </script>
}


function addExpr(template, pos, tokens) {
  const i = template.indexOf('}', pos + 2)
  if (i == -1) throw new SyntaxError(`Unclosed expression at ${pos}`)
  const end = i + 1
  tokens.push(template.slice(pos, end))
  return end
}

function addText(template, pos, tokens) {
  let i = pos
  while (i < template.length) {
    if (template[i] == '<' || (i + 1 < template.length && '$#'.includes(template[i]) && template[i + 1] == '{')) {
      break
    }
    i++
  }
  tokens.push(template.slice(pos, i))
  return i
}

function throwSyntaxError(pos, snippet) {
  throw new SyntaxError(`Unclosed tag at position ${pos}: "${snippet}"`)
}

