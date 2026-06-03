import pool from '../db/client.js'
import { generateQRDataURL } from '../utils/qr.js'
import { requireRole } from '../middleware/authenticate.js'

const DEPARTMENTS = ['office', 'vendor', 'participants', 'cab_driver', 'tourist_guide']

export default async function passRoutes(fastify) {
  // Public: user self-registration (1-day pass, valid today only)
  fastify.post('/passes', async (request, reply) => {
    const { name, phone, department } = request.body

    if (!name || !phone || !department) {
      return reply.status(400).send({ error: 'Name, phone and department are required' })
    }
    if (!DEPARTMENTS.includes(department)) {
      return reply.status(400).send({ error: 'Invalid department' })
    }

    const existing = await pool.query('SELECT id FROM passes WHERE phone = $1', [phone])
    if (existing.rows.length > 0) {
      return reply.status(409).send({ error: 'A pass already exists for this phone number' })
    }

    const today = new Date().toISOString().split('T')[0]

    const result = await pool.query(
      `INSERT INTO passes (name, phone, department, valid_from, valid_until)
       VALUES ($1, $2, $3, $4, $4) RETURNING id`,
      [name, phone, department, today]
    )

    const passId = result.rows[0].id
    const qr = await generateQRDataURL(passId)
    return { passId, qr }
  })

  // Public: get pass by ID (for QR page after registration)
  fastify.get('/passes/:id', async (request, reply) => {
    const { id } = request.params
    const result = await pool.query('SELECT * FROM passes WHERE id = $1', [id])
    if (result.rows.length === 0) return reply.status(404).send({ error: 'Pass not found' })

    const pass = result.rows[0]
    const qr = await generateQRDataURL(pass.id)
    return { ...pass, qr }
  })

  // Admin: generate pass with custom duration
  fastify.post('/admin/passes', { preHandler: requireRole('admin') }, async (request, reply) => {
    const { name, phone, department, valid_from, valid_until } = request.body

    if (!name || !phone || !department || !valid_from || !valid_until) {
      return reply.status(400).send({ error: 'All fields are required' })
    }
    if (!DEPARTMENTS.includes(department)) {
      return reply.status(400).send({ error: 'Invalid department' })
    }
    if (valid_from > valid_until) {
      return reply.status(400).send({ error: 'valid_from must be before valid_until' })
    }

    const existing = await pool.query('SELECT id FROM passes WHERE phone = $1', [phone])
    if (existing.rows.length > 0) {
      return reply.status(409).send({ error: 'A pass already exists for this phone number' })
    }

    const result = await pool.query(
      `INSERT INTO passes (name, phone, department, valid_from, valid_until)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, phone, department, valid_from, valid_until]
    )

    const passId = result.rows[0].id
    const qr = await generateQRDataURL(passId)
    return { passId, qr }
  })

  // Admin: list all passes with optional filters
  fastify.get('/admin/passes', { preHandler: requireRole('admin') }, async (request) => {
    const { search, department, status } = request.query

    const conditions = ['1=1']
    const params = []

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(name ILIKE $${params.length} OR phone ILIKE $${params.length})`)
    }
    if (department) {
      params.push(department)
      conditions.push(`department = $${params.length}`)
    }
    if (status) {
      params.push(status)
      conditions.push(`status = $${params.length}`)
    }

    const result = await pool.query(
      `SELECT * FROM passes WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
      params
    )
    return result.rows
  })

  // Admin: stats summary
  fastify.get('/admin/stats', { preHandler: requireRole('admin') }, async () => {
    const result = await pool.query(`
      SELECT
        COUNT(*)                                        AS total,
        COUNT(*) FILTER (WHERE status = 'checked_in')  AS checked_in,
        COUNT(*) FILTER (WHERE status = 'active')       AS active,
        COUNT(*) FILTER (WHERE status = 'revoked')      AS revoked,
        COUNT(*) FILTER (WHERE department = 'office')         AS office,
        COUNT(*) FILTER (WHERE department = 'vendor')         AS vendor,
        COUNT(*) FILTER (WHERE department = 'participants')   AS participants,
        COUNT(*) FILTER (WHERE department = 'cab_driver')     AS cab_driver,
        COUNT(*) FILTER (WHERE department = 'tourist_guide')  AS tourist_guide
      FROM passes
    `)
    return result.rows[0]
  })

  // Admin: revoke pass
  fastify.patch('/admin/passes/:id/revoke', { preHandler: requireRole('admin') }, async (request, reply) => {
    const { id } = request.params
    const result = await pool.query(
      `UPDATE passes SET status = 'revoked' WHERE id = $1 RETURNING id`,
      [id]
    )
    if (result.rows.length === 0) return reply.status(404).send({ error: 'Pass not found' })
    return { message: 'Pass revoked' }
  })
}
