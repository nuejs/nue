
// Change kv.js to create isolated instances
export function createKV(path) {
  const store = new Map()
  let filepath = path

  async function get(key, opts) {
    const val = store.get(key)
    return val == null ? null : opts?.type == 'json' ? JSON.parse(val) : val
  }

  async function put(key, value) {
    store.set(key, typeof value == 'object' ? JSON.stringify(value) : String(value))
    if (filepath) await serialize()
  }

  async function remove(key) {
    const deleted = store.delete(key)
    if (filepath) await serialize()
    return deleted
  }

  async function list(opts = {}) {
    const { prefix = '', limit = 1000 } = opts
    const keys = Array.from(store.keys())
      .filter(key => key.startsWith(prefix))
      .slice(0, limit)

    return {
      keys: keys.map(name => ({ name })),
      list_complete: true,
      cursor: null
    }
  }

  async function serialize() {
    const data = Object.fromEntries(store)
    await Bun.write(filepath, JSON.stringify(data, null, 2))
  }

  async function deserialize() {
    try {
      const data = await Bun.file(filepath).json()
      store.clear()
      Object.entries(data).forEach(([k, v]) => store.set(k, v))
    } catch {}
  }

  if (path) {
    deserialize()
  }

  return { get, put, delete: remove, list }
}