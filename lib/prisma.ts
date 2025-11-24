import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

function createPrismaClient() {
  // Create a PostgreSQL connection pool with settings for development
  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3, // Limited for Prisma Dev compatibility (metadata + page + tracking)
    min: 1, // Keep 1 connection ready
    idleTimeoutMillis: 10000, // Close idle connections after 10s
    connectionTimeoutMillis: 10000, // 10s timeout for new connections
    allowExitOnIdle: false, // Don't exit on idle in development
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool
  }

  // Create the adapter
  const adapter = new PrismaPg(pool)

  // Create Prisma Client with the adapter (required for Prisma 7.0.0)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
