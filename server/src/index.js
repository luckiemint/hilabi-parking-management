import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import 'dotenv/config'

import authRoutes from './routes/auth.js'
import passRoutes from './routes/passes.js'
import scanRoutes from './routes/scans.js'

const fastify = Fastify({ logger: true })

await fastify.register(cors, { origin: true })
await fastify.register(jwt, { secret: process.env.JWT_SECRET || 'change-me-in-production' })

fastify.register(authRoutes, { prefix: '/api/auth' })
fastify.register(passRoutes, { prefix: '/api' })
fastify.register(scanRoutes, { prefix: '/api' })

fastify.get('/health', () => ({ status: 'ok' }))

const port = Number(process.env.PORT) || 3001
await fastify.listen({ port, host: '0.0.0.0' })
