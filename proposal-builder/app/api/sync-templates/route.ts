import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/sync-templates - Sync templates from a proposal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { proposalId } = body;

    // Default to boom-marketing proposal if no ID provided
    const proposalSlug = proposalId ? undefined : 'boom-marketing-teljes-csomag-2025';

    console.log('🔍 Fetching proposal...', proposalId ? `ID: ${proposalId}` : `Slug: ${proposalSlug}`);

    const proposal = await prisma.proposal.findUnique({
      where: proposalId ? { id: proposalId } : { slug: proposalSlug },
      include: {
        blocks: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Found proposal with ${proposal.blocks.length} blocks`);
    console.log('📝 Creating/updating templates from proposal blocks...');

    const results = [];

    for (const block of proposal.blocks) {
      console.log(`  Processing ${block.blockType}...`);

      const template = await prisma.blockTemplate.upsert({
        where: {
          blockType_name_brand: {
            blockType: block.blockType,
            name: 'Alapértelmezett',
            brand: proposal.brand,
          },
        },
        update: {
          defaultContent: block.content as any,
          description: `Alapértelmezett ${block.blockType.replace(/_/g, ' ')} sablon`,
          displayOrder: block.displayOrder,
          isActive: block.isEnabled,
          updatedAt: new Date(),
        },
        create: {
          blockType: block.blockType,
          name: 'Alapértelmezett',
          brand: proposal.brand,
          description: `Alapértelmezett ${block.blockType.replace(/_/g, ' ')} sablon`,
          defaultContent: block.content as any,
          displayOrder: block.displayOrder,
          isActive: block.isEnabled,
        },
      });

      results.push(template);
      console.log(`    ✓ Template saved`);
    }

    console.log('✅ All templates synchronized!');

    return NextResponse.json({
      success: true,
      message: 'Templates synchronized successfully',
      totalBlocks: proposal.blocks.length,
      enabled: proposal.blocks.filter((b: any) => b.isEnabled).length,
      disabled: proposal.blocks.filter((b: any) => !b.isEnabled).length,
      templates: results,
    });
  } catch (error) {
    console.error('Error syncing templates:', error);
    return NextResponse.json(
      { error: 'Failed to sync templates' },
      { status: 500 }
    );
  }
}
