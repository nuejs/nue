
// session.js
export function createAuth(env) {
  const { KV } = env

  function getSessionId(req) {
    return req.header('Authorization')?.replace('Bearer ', '')
  }

  function validate(email, password) {
    return email == env.ADMIN_EMAIL && password == env.ADMIN_PASSWORD
  }

  async function addSession(data) {
    const sessionId = crypto.randomUUID()
    await KV.put(`session:${sessionId}`, { ...data, created: Date.now() })
    return sessionId
  }

  async function getUser(req) {
    const sessionId = getSessionId(req)
    return sessionId && await KV.get(`session:${sessionId}`, { type: 'json' })
  }

  async function logout(req) {
    const sessionId = getSessionId(req)
    return sessionId && await KV.delete(`session:${sessionId}`)
  }

  return { getSessionId, validate, addSession, getUser, logout }
}