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
        passwordHash: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    const proposals = await prisma.proposal.findMany({
      include: {
        blocks: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    });

    const blockTemplates = await prisma.blockTemplate.findMany({
      orderBy: {
        displayOrder: 'asc'
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
        blocks: proposals.reduce((sum: number, p) => sum + p.blocks.length, 0)
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
