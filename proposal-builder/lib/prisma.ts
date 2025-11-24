import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

function createPrismaClient() {
  // Create a PostgreSQL connection pool
  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool
  }

  // Create the adapter for Prisma 7
  const adapter = new PrismaPg(pool)

  // Create Prisma Client with the adapter
  return new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
