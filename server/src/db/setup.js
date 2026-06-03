import pool from './client.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function setup() {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(schema)
  console.log('Schema created')

  const adminHash = await bcrypt.hash('admin123', 10)
  await pool.query(
    `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING`,
    ['admin', adminHash, 'admin']
  )

  const scannerHash = await bcrypt.hash('scanner123', 10)
  await pool.query(
    `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING`,
    ['scanner', scannerHash, 'scanner']
  )

  console.log('Done. Default logins: admin/admin123 | scanner/scanner123')
  await pool.end()
}

setup().catch(console.error)
