
export function createConsole(text, callback) {
  const scenes = text.trim().split('---').map(s => s.trim().split('\n'))
  let scene = 0
  let currentRun = 0

  function runScene() {
    if (scene >= scenes.length) return callback({ completed: true, scene })

    const runId = ++currentRun
    callback({ scene_started: true, scene })

    runLines(scenes[scene], e => {
      if (currentRun == runId) {
        callback({ ...e, scene })
      }
    }, () => currentRun == runId)
  }

  return {
    get totalScenes() { return scenes.length },
    get currentScene() { return scene },

    next() {
      if (scene < scenes.length - 1) scene++
      else scene = 0
      runScene()
    },
    prev() {
      if (scene > 0) scene--
      else scene = scenes.length - 1
      runScene()
    },
    start: runScene,
  }
}

function runLines(lines, callback, isActive) {
  let i = 0

  function nextLine() {
    if (!isActive()) return
    if (i >= lines.length) return callback({ scene_ended: true })

    const line = lines[i]
    const is_command = line.startsWith('$')
    const fn = is_command ? runCommand : processResponse
    callback({ line_started: true, is_command })

    fn(line, (line, line_done) => {
      if (!isActive()) return
      callback({ line, line_done, is_command })
      if (line_done) { i++; setTimeout(nextLine, 20) }
    }, isActive)
  }

  nextLine()
}

function runCommand(text, callback, isActive) {
  text = text.slice(2)
  let output = ''
  let i = 0

  function type() {
    if (!isActive()) return
    if (i >= text.length) {
      callback(output, true)
      return
    }

    const char = text[i]
    if (char == '^') output = output.slice(0, -1)
    else output += char
    callback(output)
    i++

    const delay = Math.random() * (text[0] == '#' ? 75 : 200)
    setTimeout(type, delay)
  }

  type()
}

function processResponse(str, callback, isActive) {
  const { text, time, delay } = parseDelay(str)
  setTimeout(() => {
    if (!isActive()) return
    if (time) {
      callback(text, false)
      setTimeout(() => {
        if (!isActive()) return
        callback(text + `<time>[${time}ms]</time>`, true)
      }, time)
    } else {
      callback(text, true)
    }
  }, delay)
}

function parseDelay(text) {

  // prefix: 1s: ___
  let match = text.trim().match(/(\d+(?:\.\d+)?)s:(\s*.+)$/)
  const delay = match ? parseFloat(match[1]) * 1000 : 0
  if (match) text = match[2]

  // suffix: ___ [10ms]
  match = text.match(/^(.+?)\s*\[(\d+)ms\]$/)
  const time = match ? parseInt(match[2]) : 0
  if (match) text = match[1]
  return { text, time, delay }
}


