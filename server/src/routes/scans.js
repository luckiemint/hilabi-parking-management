import pool from '../db/client.js'
import { requireRole } from '../middleware/authenticate.js'

export default async function scanRoutes(fastify) {
  // Scanner: process a scan (check-in or check-out)
  fastify.post('/scans', { preHandler: requireRole('admin', 'scanner') }, async (request, reply) => {
    const { passId, action } = request.body

    if (!passId || !['check_in', 'check_out'].includes(action)) {
      return reply.status(400).send({ error: 'passId and action (check_in | check_out) required' })
    }

    const result = await pool.query('SELECT * FROM passes WHERE id = $1', [passId])
    if (result.rows.length === 0) {
      return { status: 'invalid', message: 'Pass not found' }
    }

    const pass = result.rows[0]
    const today = new Date().toISOString().split('T')[0]

    if (pass.status === 'revoked') {
      return { status: 'revoked', message: 'This pass has been revoked', pass }
    }

    if (pass.valid_until < today) {
      return { status: 'expired', message: 'This pass has expired', pass }
    }

    if (action === 'check_in') {
      if (pass.status === 'checked_in') {
        return {
          status: 'already_checked_in',
          message: 'This pass is already checked in. Please purchase a new pass.',
          pass,
        }
      }

      await pool.query(
        `UPDATE passes SET status = 'checked_in', checked_in_at = NOW(), checked_out_at = NULL WHERE id = $1`,
        [pass.id]
      )
      await pool.query(`INSERT INTO scan_logs (pass_id, action) VALUES ($1, 'check_in')`, [pass.id])

      return { status: 'checked_in', message: 'Checked in successfully', pass: { ...pass, status: 'checked_in' } }
    }

    if (action === 'check_out') {
      if (pass.status !== 'checked_in') {
        return { status: 'not_checked_in', message: 'This pass is not currently checked in', pass }
      }

      await pool.query(
        `UPDATE passes SET status = 'active', checked_out_at = NOW() WHERE id = $1`,
        [pass.id]
      )
      await pool.query(`INSERT INTO scan_logs (pass_id, action) VALUES ($1, 'check_out')`, [pass.id])

      return { status: 'checked_out', message: 'Checked out successfully', pass: { ...pass, status: 'active' } }
    }
  })

  // Admin: recent scan logs
  fastify.get('/admin/scans', { preHandler: requireRole('admin') }, async () => {
    const result = await pool.query(`
      SELECT sl.id, sl.action, sl.scanned_at, p.name, p.phone, p.department, p.id AS pass_id
      FROM scan_logs sl
      JOIN passes p ON sl.pass_id = p.id
      ORDER BY sl.scanned_at DESC
      LIMIT 100
    `)
    return result.rows
  })
}
