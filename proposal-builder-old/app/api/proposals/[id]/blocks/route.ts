import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/proposals/[id]/blocks - Update block order and enabled status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { blocks } = body;

    if (!Array.isArray(blocks)) {
      return NextResponse.json(
        { error: 'Blocks must be an array' },
        { status: 400 }
      );
    }

    // Two-phase update to avoid unique constraint conflicts
    // Phase 1: Set all displayOrders to negative values temporarily
    for (let i = 0; i < blocks.length; i++) {
      await prisma.proposalBlock.update({
        where: { id: blocks[i].id },
        data: {
          displayOrder: -(i + 1), // Negative temporary value
        },
      });
    }

    // Phase 2: Set final displayOrder values
    for (const block of blocks) {
      await prisma.proposalBlock.update({
        where: { id: block.id },
        data: {
          displayOrder: block.displayOrder,
          isEnabled: block.isEnabled,
        },
      });
    }

    console.log('✅ Blocks updated successfully:', {
      proposalId: id,
      blockCount: blocks.length,
      blocks: blocks.map(b => ({
        id: b.id.slice(0, 8),
        type: b.blockType,
        order: b.displayOrder,
        enabled: b.isEnabled
      }))
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating blocks:', error);
    return NextResponse.json(
      { error: 'Failed to update blocks' },
      { status: 500 }
    );
  }
}
