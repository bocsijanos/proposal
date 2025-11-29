import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/sensitive/proposals/[slug]
 * Returns sensitive proposal data (contact info, creator info)
 * This endpoint is called client-side to prevent bots from indexing personal data
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      select: {
        clientEmail: true,
        clientPhone: true,
        clientContactName: true,
        createdByName: true,
        createdBy: {
          select: {
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Return sensitive data
    return NextResponse.json({
      clientEmail: proposal.clientEmail,
      clientPhone: proposal.clientPhone,
      clientContactName: proposal.clientContactName,
      createdByName: proposal.createdByName,
      adminName: proposal.createdBy?.name,
      adminEmail: proposal.createdBy?.email,
      adminPhone: proposal.createdBy?.phone,
      adminAvatar: proposal.createdBy?.avatarUrl,
    });
  } catch (error) {
    console.error('Error fetching sensitive data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sensitive data' },
      { status: 500 }
    );
  }
}
