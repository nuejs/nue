
import { createWorker } from './worker.js'
import { createProxy } from './proxy.js'

export async function getWorker(opts={}) {
  return opts.url ? createProxy(opts) : await createWorker(opts)
}
