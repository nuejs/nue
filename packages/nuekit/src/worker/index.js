
import { createWorker } from './worker.js'
import { createProxy } from './proxy.js'

export function getWorker(conf={}) {
  return conf.server ? createWorker(conf) : conf.url ? createProxy(conf) : null
}
