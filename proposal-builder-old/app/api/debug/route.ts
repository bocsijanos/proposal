import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
      NODE_ENV: process.env.NODE_ENV,
    };

    // Try to connect to database
    let dbStatus = 'not tested';
    let dbError = null;

    try {
      const { prisma } = await import('@/lib/prisma');
      const userCount = await prisma.user.count();
      dbStatus = `connected - ${userCount} users`;
    } catch (error: any) {
      dbStatus = 'failed';
      dbError = error.message;
    }

    return NextResponse.json({
      status: 'debug',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Debug endpoint error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}