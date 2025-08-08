
import { createWorker } from './worker.js'
import { createProxy } from './proxy.js'

export async function getServer(opts={}) {
  return opts.url ? createProxy(opts) : await createWorker(opts)
}
