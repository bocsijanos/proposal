import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database reset (dropping all tables)...');

    // Get all table names
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;

    console.log(`Found ${tables.length} tables to drop`);

    // Drop all tables
    for (const { tablename } of tables) {
      try {
        console.log(`Dropping table: ${tablename}`);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE`);
      } catch (error) {
        console.error(`Failed to drop table ${tablename}:`, error);
      }
    }

    // Get all enum types
    const enums = await prisma.$queryRaw<Array<{ typname: string }>>`
      SELECT typname
      FROM pg_type
      WHERE typtype = 'e' AND typnamespace = (
        SELECT oid FROM pg_namespace WHERE nspname = 'public'
      )
    `;

    console.log(`Found ${enums.length} enum types to drop`);

    // Drop all enum types
    for (const { typname } of enums) {
      try {
        console.log(`Dropping enum type: ${typname}`);
        await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "${typname}" CASCADE`);
      } catch (error) {
        console.error(`Failed to drop enum ${typname}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Database reset successfully',
      success: true,
      tablesDropped: tables.length,
      enumsDropped: enums.length
    });

  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      {
        error: 'Failed to reset database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
