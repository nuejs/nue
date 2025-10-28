import { createInterface } from 'node:readline'
import { styleText } from 'node:util'

export function createFlow() {
  const margin = '  '
  console.clear()

  function header({ title, desc }) {
    console.log('')
    print(styleText('bold', title))
    print(styleText('gray', desc))
    console.log('')
  }

  async function ask(opts) {
    const { question, validate, validateError, check, checkError, success } = opts
    header(opts)
    while (true) {
      const input = await prompt(question)
      if (validate && !validate(input)) {
        printError(validateError)
        continue
      }
      if (check) {
        printWait('checking...')
        try {
          const ok = await check(input)
          if (!ok) {
            printError(checkError)
            continue
          }
        } catch (err) {
          printError(checkError)
          continue
        }
      }
      printSuccess(success)
      return input
    }
  }

  async function wait(opts) {
    const { message, poll, pollError, success } = opts
    const timeout = 600000
    header(opts)
    if (message) printSuccess(message)
    printWait('waiting...')
    const startTime = Date.now()
    const pollInterval = 500
    while (Date.now() - startTime < timeout) {
      try {
        const result = await poll()
        if (result) {
          printSuccess(success)
          return result
        }
      } catch (err) {
        // continue polling
      }
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }
    printError(pollError)
    throw new Error('verification timeout')
  }

  async function waitEnter(opts) {
    header(opts)
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    return new Promise(resolve => {
      rl.once('line', () => {
        rl.close()
        resolve()
      })
    })
  }

  async function prompt(label) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    return new Promise(resolve => {
      rl.question(`${margin}${label}: `, answer => {
        rl.close()
        resolve(answer.trim())
      })
    })
  }

  function print(text) {
    console.log(margin + text)
  }

  function printError(text) {
    print(styleText('red', '✗ ') + styleText('gray', text))
    console.log('')
  }

  function printSuccess(text) {
    print(styleText('green', '✓ ') + styleText('gray', text))
  }

  function printWait(text) {
    print(styleText('cyan', '→ ') + styleText('gray', text))
  }

  return { ask, wait, waitEnter }
}