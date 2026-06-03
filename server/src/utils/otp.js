import pool from '../db/client.js'

export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createOTP(phone) {
  const code = generateCode()
  const minutes = Number(process.env.OTP_EXPIRES_MINUTES || 10)
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000)

  await pool.query(
    `INSERT INTO otps (phone, code, expires_at) VALUES ($1, $2, $3)`,
    [phone, code, expiresAt]
  )

  // TODO: Replace with Twilio SMS integration
  console.log(`[OTP] Phone: ${phone}  Code: ${code}`)

  return code
}

export async function verifyOTP(phone, code) {
  const result = await pool.query(
    `SELECT id FROM otps
     WHERE phone = $1 AND code = $2 AND used = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [phone, code]
  )

  if (result.rows.length === 0) return false

  await pool.query(`UPDATE otps SET used = TRUE WHERE id = $1`, [result.rows[0].id])
  return true
}
