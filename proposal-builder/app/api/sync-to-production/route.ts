import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const steps: string[] = [];

    // Step 1: Run migrations
    steps.push('Running database migrations...');
    const migrationResponse = await fetch(`${baseUrl}/api/migrate-db`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const migrationResult = await migrationResponse.json();
    steps.push(`Migration result: ${JSON.stringify(migrationResult)}`);

    if (!migrationResponse.ok && !migrationResult.alreadyExisted) {
      throw new Error(`Migration failed: ${migrationResult.error || migrationResult.details}`);
    }

    // Step 2: Export data
    steps.push('Exporting data from database...');
    const exportResponse = await fetch(`${baseUrl}/api/export-data`);
    const exportResult = await exportResponse.json();
    steps.push(`Export result: ${JSON.stringify(exportResult.counts)}`);

    if (!exportResponse.ok) {
      throw new Error(`Export failed: ${exportResult.error || exportResult.details}`);
    }

    // Step 3: Import data
    steps.push('Importing data to production...');
    const importResponse = await fetch(`${baseUrl}/api/import-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exportResult)
    });
    const importResult = await importResponse.json();
    steps.push(`Import result: ${JSON.stringify(importResult.summary)}`);

    if (!importResponse.ok) {
      throw new Error(`Import failed: ${importResult.error || importResult.details}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Database sync completed successfully',
      steps,
      summary: importResult.summary
    });

  } catch (error) {
    console.error('Error syncing to production:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync to production',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
