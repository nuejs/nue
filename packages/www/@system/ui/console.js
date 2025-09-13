
export function createConsole(text, callback) {
  const scenes = text.trim().split('---').map(s => s.trim().split('\n'))

  let scene = 0

  function runScene() {
    if (scene >= scenes.length) return callback({ completed: true, scene })
    callback({ scene_started: true, scene })

    runLines(scenes[scene], e => {
      callback({ ...e, scene })
    })
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


function runLines(lines, callback) {
  let i = 0

  function nextLine() {
    if (i >= lines.length) return callback({ scene_ended: true })

    const line = lines[i]
    const is_command = line.startsWith('$')

    const fn = is_command ? runCommand : processResponse

    callback({ line_started: true, is_command })

    fn(line, (line, line_done) => {
      callback({ line, line_done, is_command })
      if (line_done) { i++; setTimeout(nextLine, 20) } // brief pause between lines
    })
  }

  nextLine()
}


// type user command
function runCommand(text, callback) {
  text = text.slice(2)
  let output = ''
  let i = 0
  
  function type() {
    if (i >= text.length) {
      callback(output, true)
      return
    }
    
    const char = text[i]
    if (char == '^') output = output.slice(0, -1) // Backspace
    else output += char
    callback(output)
    i++
    
    // Random delay 80-150ms
    const delay = Math.random() * (text[0] == '#' ? 100 : 200)
    setTimeout(type, delay)
  }
  
  type()
}

function processResponse(str, callback) {
  const { text, time, delay } = parseDelay(str)

  setTimeout(() => {
    if (time) {
      callback(text, false)
      setTimeout(() => {
        callback(text + `<time>[${time}ms]</time>`, true)
      }, time)
    } else {
      callback(text, true)
    }
  }, delay)
}

function parseDelay(text) {

  // prefix: "2s: ___"
  let match = text.trim().match(/(\d+(?:\.\d+)?)s:(\s*.+)$/)
  const delay = match ? parseFloat(match[1]) * 1000 : 0
  if (match) text = match[2]


  // suffix: "___ [300ms]"
  match = text.match(/^(.+?)\s*\[(\d+)ms\]$/)
  const time = match ? parseInt(match[2]) : 0
  if (match) text = match[1]

  return { text, time, delay }
}


