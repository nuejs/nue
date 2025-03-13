
/* fetch and auth */
export async function fetchWithAuth(path, as_text) {
  const { sid } = sessionStorage
  if (!sid) throw new Error('No active session')

  const res = await fetch('/app/mocks/' + path, {
    headers: { 'Authorization': `Bearer ${sid}` }
  })

  return as_text ? await res.text() : await res.json()
}


export async function login(email, password) {
  const response = await fetch('/app/mocks/login.json', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    method: 'POST',
  })

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

  return await response.text()
}