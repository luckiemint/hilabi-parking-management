import bcrypt from 'bcryptjs'
import pool from '../db/client.js'
import { createOTP, verifyOTP } from '../utils/otp.js'

export default async function authRoutes(fastify) {
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    const user = result.rows[0]

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    const token = fastify.jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    )

    return { token, role: user.role, username: user.username }
  })

  fastify.post('/otp/send', async (request, reply) => {
    const { phone } = request.body
    if (!phone) return reply.status(400).send({ error: 'Phone required' })
    await createOTP(phone)
    return { message: 'OTP sent' }
  })

  fastify.post('/otp/verify', async (request, reply) => {
    const { phone, code } = request.body
    const valid = await verifyOTP(phone, code)
    if (!valid) return reply.status(400).send({ error: 'Invalid or expired OTP' })
    return { verified: true }
  })
}
