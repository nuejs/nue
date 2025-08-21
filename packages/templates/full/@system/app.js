
/*
  Authentication and server communication
*/

export async function login(email, password) {
  const ret = await post('/api/login', { email, password })
  localStorage.$sid = ret.sessionId
}

export async function postContact(data) {
  return await post('/api/contacts', data)
}

export async function getContacts(params) {
  return await get('/admin/contacts', params)
}

export async function getContact(id) {
  return await get(`/admin/contacts/${id}`)
}

export async function deleteContact(id) {
  return await del(`/admin/contacts/${id}`)
}

export function hasSession() {
  return !!localStorage.$sid
}

export async function logout() {
  await get('/admin/logout')
  delete localStorage.$sid
  return true
}


/* private helper functions */

async function post(route, data) {
  const resp = await fetch(route, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
    method: 'POST',
  })

  catchError(resp)
  return await resp.json()
}

async function get(route, params) {
  const qs =  new URLSearchParams(params).toString()
  if (qs) route += `?${ qs }`

  const resp = await fetch(route, { headers: getAuthHeader() })
  catchError(resp)
  return await resp.json()
}

async function del(route) {
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

