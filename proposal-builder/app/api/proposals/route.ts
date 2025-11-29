import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/proposals - List all proposals with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await prisma.proposal.count();

    const proposals = await prisma.proposal.findMany({
      skip,
      take: limit,
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        slug: true,
        clientName: true,
        clientContactName: true,
        clientPhone: true,
        clientEmail: true,
        brand: true,
        status: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        createdByName: true,
        _count: {
          select: {
            blocks: true,
          },
        },
      },
    });

    return NextResponse.json({
      proposals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Create new proposal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clientName, clientContactName, clientPhone, clientEmail, brand } = body;

    if (!clientName || !brand) {
      return NextResponse.json(
        { error: 'Client name and brand are required' },
        { status: 400 }
      );
    }

    // Generate unique slug with:
    // - Company name (without Hungarian accents)
    // - Brand-based proposal number (boom101, aiboost102, etc.)
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const normalizedName = removeAccents(clientName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Get brand prefix for the proposal number
    const brandPrefix = brand.toLowerCase(); // 'boom' or 'aiboost'

    // Find the highest proposal number for this brand
    const existingProposals = await prisma.proposal.findMany({
      where: {
        brand: brand,
      },
      select: { slug: true },
      orderBy: { createdAt: 'desc' },
    });

    let nextNumber = 101; // Start from 101
    if (existingProposals.length > 0) {
      // Extract numbers from slugs ending with brand prefix + number (e.g., boom101, aiboost102)
      const numbers = existingProposals
        .map(p => {
          const match = p.slug.match(new RegExp(`${brandPrefix}(\\d+)$`));
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => n > 0);

      if (numbers.length > 0) {
        nextNumber = Math.max(...numbers) + 1;
      }
    }

    const slug = `${normalizedName}-${brandPrefix}${nextNumber}`;

    // Create the proposal
    const proposal = await prisma.proposal.create({
      data: {
        slug,
        clientName,
        clientContactName: clientContactName || null,
        clientPhone: clientPhone || null,
        clientEmail: clientEmail || null,
        brand,
        status: 'DRAFT',
        createdById: session.user.id,
        createdByName: session.user.name || session.user.email || 'Unknown',
      },
    });

    // Load block templates (filtered by brand)
    const templates = await prisma.blockTemplate.findMany({
      where: {
        isActive: true,
        brand: brand,
      },
      orderBy: { displayOrder: 'asc' },
    });

    let blocksToCreate;

    if (templates.length > 0) {
      // Use templates from database - all are PUCK_CONTENT type
      // Add the template.name as title for TOC display
      blocksToCreate = templates.map((template, index) => {
        const defaultContent = template.defaultContent as Record<string, unknown>;
        return {
          blockType: 'PUCK_CONTENT' as const,
          displayOrder: index,
          isEnabled: template.isActive,
          content: {
            ...defaultContent,
            title: template.name, // Use template name for TOC display
          } as Prisma.InputJsonValue,
          templateId: template.id,
        };
      });
    } else {
      // Fallback: create a single empty PUCK_CONTENT block
      blocksToCreate = [
        {
          blockType: 'PUCK_CONTENT' as const,
          displayOrder: 0,
          isEnabled: true,
          content: {
            puckData: {
              content: [],
              root: { props: {} }
            }
          } as Prisma.InputJsonValue,
        },
      ];
    }

    // Create blocks for the proposal
    console.log(`[Proposal Creation] Creating ${blocksToCreate.length} blocks...`);
    await prisma.proposalBlock.createMany({
      data: blocksToCreate.map(block => ({
        ...block,
        proposalId: proposal.id,
      })),
    });
    console.log('[Proposal Creation] Blocks created successfully');

    // Fetch the complete proposal with blocks
    const completeProposal = await prisma.proposal.findUnique({
      where: { id: proposal.id },
      include: {
        blocks: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    console.log(`[Proposal Creation] Proposal created successfully with ${completeProposal?.blocks.length || 0} blocks`);
    return NextResponse.json(completeProposal, { status: 201 });
  } catch (error) {
    console.error('[Proposal Creation] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create proposal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
