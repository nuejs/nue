
// TODO
const BASE = 'https://account.nuejs.com'

export async function checkAvailability(name) {
  try {
    const res = await fetch(`${BASE}/accounts/${name}`)
    return res.status == 404 ? true : await res.json()
  } catch (err) {
    return false
  }
}

export async function registerAccount(name, email) {
  const res = await fetch(`${BASE}/accounts`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
    method: 'POST',
  })

  if (!res.ok) throw new Error('registration failed')
  return res.json()
}

export async function waitForVerification(verificationId) {
  try {
    const res = await fetch(`${BASE}/verify/${verificationId}`)
    if (res.ok) {
      const data = await res.json()
      return data.token
    }
  } catch (err) {
    // still waiting
  }
  return null
}