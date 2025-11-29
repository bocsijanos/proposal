import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BlockType } from '@prisma/client';

// POST /api/proposals/[id]/blocks - Create a new block
export async function POST(
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
    const { blockType, content } = body;

    // Validate block type
    if (!blockType || !Object.values(BlockType).includes(blockType)) {
      return NextResponse.json(
        { error: 'Invalid block type' },
        { status: 400 }
      );
    }

    // NEW BLOCKS GO TO THE BEGINNING (displayOrder: 0)
    // First, shift all existing blocks down by 1
    const existingBlocks = await prisma.proposalBlock.findMany({
      where: { proposalId: id },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, displayOrder: true },
    });

    // Shift existing blocks down
    for (const block of existingBlocks) {
      await prisma.proposalBlock.update({
        where: { id: block.id },
        data: { displayOrder: block.displayOrder + 1 },
      });
    }

    const newDisplayOrder = 0; // New blocks always go to the beginning

    // Default content for PUCK_CONTENT
    const defaultContent = blockType === 'PUCK_CONTENT'
      ? {
          puckData: {
            content: [],
            root: { props: {} },
          },
          title: 'Új szekció',
        }
      : content || {};

    // Create the new block
    const newBlock = await prisma.proposalBlock.create({
      data: {
        proposalId: id,
        blockType: blockType as BlockType,
        displayOrder: newDisplayOrder,
        isEnabled: true,
        content: defaultContent,
      },
    });

    console.log('✅ New block created:', {
      proposalId: id,
      blockId: newBlock.id,
      blockType: newBlock.blockType,
      displayOrder: newBlock.displayOrder,
    });

    return NextResponse.json(newBlock, { status: 201 });
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json(
      { error: 'Failed to create block' },
      { status: 500 }
    );
  }
}

// DELETE /api/proposals/[id]/blocks - Delete a block
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get('blockId');

    if (!blockId) {
      return NextResponse.json(
        { error: 'Block ID is required' },
        { status: 400 }
      );
    }

    // Verify block belongs to this proposal
    const block = await prisma.proposalBlock.findFirst({
      where: { id: blockId, proposalId: id },
    });

    if (!block) {
      return NextResponse.json(
        { error: 'Block not found' },
        { status: 404 }
      );
    }

    // Delete the block
    await prisma.proposalBlock.delete({
      where: { id: blockId },
    });

    // Reorder remaining blocks
    const remainingBlocks = await prisma.proposalBlock.findMany({
      where: { proposalId: id },
      orderBy: { displayOrder: 'asc' },
    });

    for (let i = 0; i < remainingBlocks.length; i++) {
      if (remainingBlocks[i].displayOrder !== i) {
        await prisma.proposalBlock.update({
          where: { id: remainingBlocks[i].id },
          data: { displayOrder: i },
        });
      }
    }

    console.log('✅ Block deleted:', {
      proposalId: id,
      blockId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json(
      { error: 'Failed to delete block' },
      { status: 500 }
    );
  }
}

// PATCH /api/proposals/[id]/blocks - Update block order, enabled status, and content
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

    // Phase 2: Set final displayOrder values AND content
    for (const block of blocks) {
      const updateData: any = {
        displayOrder: block.displayOrder,
        isEnabled: block.isEnabled,
      };

      // Also update content if provided (for PUCK_CONTENT blocks)
      if (block.content !== undefined) {
        updateData.content = block.content;
      }

      await prisma.proposalBlock.update({
        where: { id: block.id },
        data: updateData,
      });
    }

    console.log('✅ Blocks updated successfully:', {
      proposalId: id,
      blockCount: blocks.length,
      blocks: blocks.map(b => ({
        id: b.id.slice(0, 8),
        type: b.blockType,
        order: b.displayOrder,
        enabled: b.isEnabled,
        hasContent: b.content !== undefined
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
