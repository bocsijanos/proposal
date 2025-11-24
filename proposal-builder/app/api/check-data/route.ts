import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    // Get all proposals with counts
    const proposals = await prisma.proposal.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        clientName: true,
        status: true,
        isTemplate: true,
        templateName: true,
        _count: {
          select: {
            blocks: true,
          },
        },
      },
    });

    // Get total counts
    const counts = {
      users: await prisma.user.count(),
      proposals: await prisma.proposal.count(),
      templates: await prisma.proposal.count({ where: { isTemplate: true } }),
      blocks: await prisma.proposalBlock.count(),
    };

    return NextResponse.json({
      success: true,
      counts,
      users,
      proposals: proposals.map(p => ({
        ...p,
        blockCount: p._count.blocks,
        _count: undefined,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}