import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  // In production on Vercel, use PRISMA_DATABASE_URL (Accelerate) if available
  // In development, use DATABASE_URL (direct connection)
  const isProduction = process.env.NODE_ENV === 'production';
  const useAccelerate = isProduction && process.env.PRISMA_DATABASE_URL;

  const client = new PrismaClient({
    log: isProduction ? ['error'] : ['error', 'warn'],
    datasourceUrl: useAccelerate ? process.env.PRISMA_DATABASE_URL : process.env.DATABASE_URL,
  });

  // Use Accelerate extension in production for better serverless performance
  if (useAccelerate) {
    return client.$extends(withAccelerate());
  }

  return client;
}

// In development, properly handle hot reload by disconnecting old client
if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma) {
  (globalForPrisma.prisma as unknown as PrismaClient).$disconnect().catch(() => {
    // Ignore disconnect errors during hot reload
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
