
import { createBlock } from './block/block.js'

export function createApp(lib, data) {
  const [ app ] = lib
  if (app.is_custom)  {
    app.is_custom = false
    app.tag = 'div'
  }
  const { update, mount } = createBlock(app, data, { lib })
  return { update, mount }
}