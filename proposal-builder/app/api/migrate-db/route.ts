import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting Prisma migration deployment...');

    // Run prisma migrate deploy to apply all pending migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
      cwd: process.cwd(),
      env: {
        ...process.env,
        // Ensure we use the production DATABASE_URL from environment
      }
    });

    console.log('Migration stdout:', stdout);
    if (stderr) {
      console.log('Migration stderr:', stderr);
    }

    return NextResponse.json({
      message: 'Database migrations applied successfully',
      success: true,
      output: stdout,
      warnings: stderr || null
    });

  } catch (error) {
    console.error('Error running migrations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorOutput = (error as any).stdout || '';
    const errorWarnings = (error as any).stderr || '';

    return NextResponse.json(
      {
        error: 'Failed to run migrations',
        details: errorMessage,
        output: errorOutput,
        warnings: errorWarnings
      },
      { status: 500 }
    );
  }
}
