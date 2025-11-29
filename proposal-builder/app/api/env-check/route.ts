import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_HOST: process.env.DATABASE_URL?.match(/@([^:\/]+)/)?.[1] || 'NOT SET',
      NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}
