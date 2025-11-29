import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');

    // Test 1: Can we connect at all?
    const startTime = Date.now();
    await prisma.$connect();
    const connectTime = Date.now() - startTime;
    console.log(`✅ Database connected in ${connectTime}ms`);

    // Test 2: Can we run a simple query?
    const queryStart = Date.now();
    const result = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT NOW() as now`;
    const queryTime = Date.now() - queryStart;
    console.log(`✅ Query executed in ${queryTime}ms`);

    // Test 3: Check if any tables exist
    const tablesResult = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log(`✅ Found ${tablesResult.length} tables`);

    // Test 4: Check if any types exist
    const typesResult = await prisma.$queryRaw<Array<{ typname: string }>>`
      SELECT typname
      FROM pg_type
      WHERE typname IN ('UserRole', 'Brand', 'ProposalStatus', 'BlockType')
    `;
    console.log(`✅ Found ${typesResult.length} enum types`);

    return NextResponse.json({
      success: true,
      message: 'Database is healthy',
      details: {
        connected: true,
        connectTime: `${connectTime}ms`,
        queryTime: `${queryTime}ms`,
        serverTime: result[0]?.now,
        tablesCount: tablesResult.length,
        tables: tablesResult.map((t: { table_name: string }) => t.table_name),
        enumTypesCount: typesResult.length,
        enumTypes: typesResult.map((t: { typname: string }) => t.typname)
      }
    });

  } catch (error) {
    console.error('❌ Database health check failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Database health check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
