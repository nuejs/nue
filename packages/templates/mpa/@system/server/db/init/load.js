
import { readFile } from 'node:fs/promises'
import { Database } from 'bun:sqlite'

async function loadFile(filename, db = new Database('./db/app.db')) {
  const sql = await readFile(`./data/${filename}`, 'utf8')
  db.exec(sql)
}

export async function loadSchema(db) {
  await loadFile('schema.sql', db)
}

export async function loadData(db) {
  await loadFile('sample.sql', db)
}

// auto load
if (process.argv.includes('autoload')) {
  loadSchema()
  loadData()
}
