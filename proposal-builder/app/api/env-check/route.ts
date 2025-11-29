import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  // Simple env check - NO database connection, edge runtime
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_STARTS: process.env.DATABASE_URL?.substring(0, 30) || 'NOT SET',
      DATABASE_URL_HOST: process.env.DATABASE_URL?.match(/@([^:\/]+)/)?.[1] || 'NOT SET',
      NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}
