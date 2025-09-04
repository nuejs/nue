
import { readFile } from 'node:fs/promises'
import { Database } from 'bun:sqlite'

async function loadFile(filename, db = new Database('../app.db')) {
  const sql = await readFile(`./db/init/${filename}`, 'utf8')
  db.exec(sql)
}

export async function loadSchema(db) {
  await loadFile('schema.sql', db)
  console.log('✅ Created schema')
}

export async function loadData(db) {
  await loadFile('sample-data.sql', db)
  console.log('✅ Loaded data')
}

// auto load
if (process.argv.includes('autoload')) {
  await loadSchema()
  await loadData()
}
