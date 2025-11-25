import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ImportData {
  timestamp: string;
  users: any[];
  proposals: any[];
  blockTemplates: any[];
}

export async function POST(request: NextRequest) {
  try {
    // No authentication required - this endpoint is for automated sync

    const body = await request.json();
    const importData: ImportData = body;

    if (!importData || !importData.users || !importData.proposals || !importData.blockTemplates) {
      return NextResponse.json(
        { error: 'Invalid import data format' },
        { status: 400 }
      );
    }

    console.log('Starting data import...');
    console.log(`Users to import: ${importData.users.length}`);
    console.log(`Proposals to import: ${importData.proposals.length}`);
    console.log(`Block templates to import: ${importData.blockTemplates.length}`);

    // Import users first (they are referenced by proposals)
    const userResults = [];
    for (const user of importData.users) {
      try {
        const created = await prisma.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email,
            passwordHash: user.passwordHash,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
            updatedAt: new Date(user.updatedAt),
          },
          create: {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
          }
        });
        userResults.push({ id: created.id, email: created.email, status: 'success' });
      } catch (error) {
        userResults.push({ id: user.id, email: user.email, status: 'failed', error: (error as Error).message });
      }
    }

    // Import block templates
    const templateResults = [];
    for (const template of importData.blockTemplates) {
      try {
        const created = await prisma.blockTemplate.upsert({
          where: { id: template.id },
          update: {
            blockType: template.blockType,
            name: template.name,
            description: template.description,
            brand: template.brand,
            defaultContent: template.defaultContent,
            thumbnailUrl: template.thumbnailUrl,
            displayOrder: template.displayOrder,
            isActive: template.isActive,
            usageCount: template.usageCount,
            updatedAt: new Date(template.updatedAt),
          },
          create: {
            id: template.id,
            blockType: template.blockType,
            name: template.name,
            description: template.description,
            brand: template.brand,
            defaultContent: template.defaultContent,
            thumbnailUrl: template.thumbnailUrl,
            displayOrder: template.displayOrder,
            isActive: template.isActive,
            usageCount: template.usageCount,
            createdAt: new Date(template.createdAt),
            updatedAt: new Date(template.updatedAt),
          }
        });
        templateResults.push({ id: created.id, name: created.name, status: 'success' });
      } catch (error) {
        templateResults.push({ id: template.id, name: template.name, status: 'failed', error: (error as Error).message });
      }
    }

    // Import proposals with their blocks
    const proposalResults = [];
    for (const proposal of importData.proposals) {
      try {
        const { blocks, ...proposalData } = proposal;

        const created = await prisma.proposal.upsert({
          where: { id: proposal.id },
          update: {
            slug: proposalData.slug,
            clientName: proposalData.clientName,
            clientContactName: proposalData.clientContactName,
            clientPhone: proposalData.clientPhone,
            clientEmail: proposalData.clientEmail,
            brand: proposalData.brand,
            status: proposalData.status,
            viewCount: proposalData.viewCount,
            lastViewedAt: proposalData.lastViewedAt ? new Date(proposalData.lastViewedAt) : null,
            isTemplate: proposalData.isTemplate,
            clonedFromId: proposalData.clonedFromId,
            createdById: proposalData.createdById,
            createdByName: proposalData.createdByName,
            publishedAt: proposalData.publishedAt ? new Date(proposalData.publishedAt) : null,
            updatedAt: new Date(proposalData.updatedAt),
          },
          create: {
            id: proposal.id,
            slug: proposalData.slug,
            clientName: proposalData.clientName,
            clientContactName: proposalData.clientContactName,
            clientPhone: proposalData.clientPhone,
            clientEmail: proposalData.clientEmail,
            brand: proposalData.brand,
            status: proposalData.status,
            viewCount: proposalData.viewCount,
            lastViewedAt: proposalData.lastViewedAt ? new Date(proposalData.lastViewedAt) : null,
            isTemplate: proposalData.isTemplate,
            clonedFromId: proposalData.clonedFromId,
            createdById: proposalData.createdById,
            createdByName: proposalData.createdByName,
            createdAt: new Date(proposalData.createdAt),
            publishedAt: proposalData.publishedAt ? new Date(proposalData.publishedAt) : null,
            updatedAt: new Date(proposalData.updatedAt),
          }
        });

        // Import blocks for this proposal
        for (const block of blocks) {
          await prisma.proposalBlock.upsert({
            where: { id: block.id },
            update: {
              proposalId: block.proposalId,
              blockType: block.blockType,
              displayOrder: block.displayOrder,
              isEnabled: block.isEnabled,
              content: block.content,
              templateId: block.templateId,
              updatedAt: new Date(block.updatedAt),
            },
            create: {
              id: block.id,
              proposalId: block.proposalId,
              blockType: block.blockType,
              displayOrder: block.displayOrder,
              isEnabled: block.isEnabled,
              content: block.content,
              templateId: block.templateId,
              createdAt: new Date(block.createdAt),
              updatedAt: new Date(block.updatedAt),
            }
          });
        }

        proposalResults.push({ id: created.id, client_name: created.clientName, blocks: blocks.length, status: 'success' });
      } catch (error) {
        proposalResults.push({ id: proposal.id, client_name: proposal.clientName, status: 'failed', error: (error as Error).message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data import completed',
      results: {
        users: userResults,
        blockTemplates: templateResults,
        proposals: proposalResults,
      },
      summary: {
        usersImported: userResults.filter(r => r.status === 'success').length,
        templatesImported: templateResults.filter(r => r.status === 'success').length,
        proposalsImported: proposalResults.filter(r => r.status === 'success').length,
        totalErrors: [
          ...userResults.filter(r => r.status === 'failed'),
          ...templateResults.filter(r => r.status === 'failed'),
          ...proposalResults.filter(r => r.status === 'failed')
        ].length
      }
    });

  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      {
        error: 'Failed to import data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
