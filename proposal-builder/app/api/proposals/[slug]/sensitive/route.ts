import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API endpoint for loading sensitive proposal data client-side
 * This prevents search engine bots from indexing personal information
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
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
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Return sensitive data for client-side rendering
    return NextResponse.json({
      clientEmail: proposal.clientEmail,
      clientPhone: proposal.clientPhone,
      clientContactName: proposal.clientContactName,
      adminName: proposal.createdBy?.name || proposal.createdByName,
      adminEmail: proposal.createdBy?.email,
      adminPhone: proposal.createdBy?.phone,
      adminAvatar: proposal.createdBy?.avatarUrl,
      createdByName: proposal.createdByName || proposal.createdBy?.name,
    });
  } catch (error) {
    console.error('Error fetching sensitive data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
