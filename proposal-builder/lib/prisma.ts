import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Use PRISMA_DATABASE_URL (Accelerate) if available, otherwise fallback to DATABASE_URL
  // This is needed because Vercel serverless can't connect directly to db.prisma.io
  const datasourceUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasourceUrl,
  })
}

// In development, properly handle hot reload by disconnecting old client
if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma) {
  globalForPrisma.prisma.$disconnect().catch(() => {
    // Ignore disconnect errors during hot reload
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
