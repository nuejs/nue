
export async function post(route, data) {
  const resp = await fetch(route, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
    method: 'POST',
  })

  catchError(resp)
  return await resp.json()
}

export async function get(route, params) {
  const qs =  new URLSearchParams(params).toString()
  if (qs) route += `?${ qs }`

  const resp = await fetch(route, { headers: getAuthHeader() })
  catchError(resp)
  return await resp.json()
}

export async function del(route) {
  const resp = await fetch(route, { method: 'delete', headers: getAuthHeader() })
  catchError(resp)
  return await resp.json()
}


function getAuthHeader() {
  const sid = localStorage.$sid
  return sid ? { Authorization: `Bearer ${sid}` } : {}
}

function catchError(resp) {
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
}

