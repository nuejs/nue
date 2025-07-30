
// Nue • (c) 2025 Tero Piirainen & contributors, MIT Licensed

/*
  Universal DOM diff optimized for simplicity and performance:

  1. No VDOM overhead
     Diffs DOM nodes directly, skipping virtual tree creation

  2. Targeted updates
     Only changes attributes and children that differ

  3. Keyed diffs
     Uses keys to reuse nodes like React, but without component lifecycle baggage

  4. Positional fallback
     Handles non-keyed cases with simple, linear iteration

  5. Minimal Memory
     Brutally simple: just two Array.from() calls, no deep cloning or state tracking

  6. Raw JavaScript
     Low-level control over output (no extra transpilile step)
*/

export function domdiff(prev, next) {
  const parent = prev.parentNode
  if (prev == next) return prev
  if (!prev && next) return parent?.appendChild(next)
  if (!next && prev) return parent?.removeChild(prev)

  if (prev.nodeType == 3 && next.nodeType == 3) {
    prev.textContent = next.textContent
    return prev
  }
  if (prev.nodeType != next.nodeType || prev.tagName != next.tagName) {
    return parent.replaceChild(next, prev)
  }

  updateAttributes(prev, next)
  const kids = Array.from(next.childNodes)
  kids[0]?.getAttribute?.('key') ? diffChildrenByKey(prev, kids) : diffChildren(prev, kids)
  return prev
}

function updateAttributes(prev, next) {
  for (let attr of next.attributes) {
    if (prev.getAttribute(attr.name) != attr.value)
      prev.setAttribute(attr.name, attr.value)
  }
  for (let attr of prev.attributes) {
    if (!next.hasAttribute(attr.name))
      prev.removeAttribute(attr.name)
  }
}

function diffChildren(prev, kids) {
  const prevKids = Array.from(prev.childNodes)
  const len = Math.max(prevKids.length, kids.length)
  for (let i = 0; i < len; i++) {
    const prevKid = prevKids[i]
    const kid = kids[i]
    if (!prevKid) prev.appendChild(kid)
    else if (!kid) prev.removeChild(prevKids[i])
    else domdiff(prevKid, kid, prev)
  }
}

function diffChildrenByKey(prev, kids) {
  const prevKids = Array.from(prev.childNodes)
  const keyMap = {}
  for (let kid of prevKids) keyMap[kid.getAttribute('key')] = kid
  while (prev.firstChild) prev.removeChild(prev.firstChild)
  for (let kid of kids) {
    const key = kid.getAttribute('key')
    const prevKid = keyMap[key]
    prev.appendChild(prevKid ? domdiff(prevKid, kid, prev) : kid)
  }
}