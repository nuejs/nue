
import { getCountryName } from './countries.js'

export function createCRM(env) {
  const { DB } = env

  async function addMember(data) {
    const result = await DB.prepare(`
      INSERT INTO contacts (email, country, subscribed, source, comment) VALUES (?, ?, ?, ?, ?)
    `).bind(data.email, data.country, 1, data.source, data.comment).run()

    return { ...data, id: result.lastInsertRowid }
  }

  async function addContact(data) {
    const result = await DB.prepare(`
      INSERT INTO contacts (name, email, country, subscribed, source, comment, company_name, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
       data.name,
       data.email,
       data.country,
       data.subscribed,
       data.source,
       data.comment,
       data.company_name,
       data.website
     ).run()

    return { ...data, id: result.lastInsertRowid }
  }

  async function deleteContact(id) {
    return await DB.prepare('DELETE FROM contacts WHERE id = ?').bind(id).run()
  }

  async function getContact(id) {
    const data = await DB.prepare('SELECT * FROM contacts WHERE id = ?').bind(id).first()
    return createContact(data)
  }

  async function getContacts({ query, start = 0, type, length = 20 }) {
    const bindings = []
    const cond = []

    if (query) {
      cond.push('(email LIKE ? OR name LIKE ? OR company_name LIKE ?)')
      bindings.push(`%${query}%`, `%${query}%`, `%${query}%`)
    }

    if (type) cond.push(type == 'member' ? 'name IS NULL' : 'name IS NOT NULL')

    const where = cond[0] ? `WHERE ${cond.join(' AND ')}` : ''

    const sql = `SELECT * FROM contacts ${where} ORDER BY created DESC LIMIT ? OFFSET ?`

    bindings.push(length, start)

    const arr = await DB.prepare(sql).bind(...bindings).all()

    return {
      results: arr.map(createContact),
      count: await getCount(DB, type),
      length: 1 * length,
      start: 1 * start,
    }
  }

  return {
    addContact,
    getContact,
    getContacts,
    deleteContact,
  }
}

async function getCount(DB, type) {
  const sql = ['SELECT count(*) as count from contacts']
  if (type) sql.push(' WHERE ' + (type == 'member' ? 'name IS NULL' : 'name IS NOT NULL'))
  const { count } = await DB.prepare(sql.join(' ')).first()
  return count
}

function createContact(data) {
  data = cleanNulls(data)
  data.country_name = getCountryName(data.country)
  return data
}

function cleanNulls(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null)
  )
}