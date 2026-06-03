export async function authenticate(request, reply) {
  try {
    await request.jwtVerify()
  } catch {
    reply.status(401).send({ error: 'Unauthorized' })
  }
}

export function requireRole(...roles) {
  return async (request, reply) => {
    await authenticate(request, reply)
    if (!roles.includes(request.user?.role)) {
      reply.status(403).send({ error: 'Forbidden' })
    }
  }
}
