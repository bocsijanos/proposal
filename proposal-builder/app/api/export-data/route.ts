import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Exporting database data...');

    // Export all data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password_hash: true,
        name: true,
        role: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      }
    });

    const proposals = await prisma.proposal.findMany({
      include: {
        blocks: {
          orderBy: {
            display_order: 'asc'
          }
        }
      }
    });

    const blockTemplates = await prisma.blockTemplate.findMany({
      orderBy: {
        display_order: 'asc'
      }
    });

    const exportData = {
      timestamp: new Date().toISOString(),
      users,
      proposals,
      blockTemplates,
    };

    return NextResponse.json({
      success: true,
      data: exportData,
      counts: {
        users: users.length,
        proposals: proposals.length,
        blockTemplates: blockTemplates.length,
        blocks: proposals.reduce((sum, p) => sum + p.blocks.length, 0)
      }
    });

  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      {
        error: 'Failed to export data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
