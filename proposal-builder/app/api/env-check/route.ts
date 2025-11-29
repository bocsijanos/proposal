import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  // Check for all database-related env vars
  const dbUrl = process.env.DATABASE_URL;
  const prismaDbUrl = process.env.PRISMA_DATABASE_URL;
  const directDbUrl = process.env.DIRECT_DATABASE_URL;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_EXISTS: !!dbUrl,
      DATABASE_URL_HOST: dbUrl?.match(/@([^:\/]+)/)?.[1] || 'NOT SET',
      DATABASE_URL_IS_ACCELERATE: dbUrl?.includes('accelerate.prisma-data.net') || false,

      PRISMA_DATABASE_URL_EXISTS: !!prismaDbUrl,
      PRISMA_DATABASE_URL_HOST: prismaDbUrl?.match(/@([^:\/]+)/)?.[1] || 'NOT SET',

      DIRECT_DATABASE_URL_EXISTS: !!directDbUrl,

      NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}
