
/* fetch and auth */
const is_live = location.hostname.endsWith('nuejs.org')

export async function fetchWithAuth(path, as_text) {
  const { sid } = localStorage
  if (!sid) throw new Error('No active session')

  const res = await fetch('/app/mocks/' + path, {
    headers: { 'Authorization': `Bearer ${sid}` }
  })

  return as_text ? await res.text() : await res.json()
}


export async function login(email, password) {
  const res = await fetch('/app/mocks/login.json', is_live ? undefined : {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    method: 'POST',
  })

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

  return await res.json()
}