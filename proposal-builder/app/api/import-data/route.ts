import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ImportData {
  timestamp: string;
  users: any[];
  proposals: any[];
  blockTemplates: any[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const importData: ImportData = body.data;

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
            password_hash: user.password_hash,
            name: user.name,
            role: user.role,
            is_active: user.is_active,
            last_login_at: user.last_login_at ? new Date(user.last_login_at) : null,
            updated_at: new Date(user.updated_at),
          },
          create: {
            id: user.id,
            email: user.email,
            password_hash: user.password_hash,
            name: user.name,
            role: user.role,
            is_active: user.is_active,
            last_login_at: user.last_login_at ? new Date(user.last_login_at) : null,
            created_at: new Date(user.created_at),
            updated_at: new Date(user.updated_at),
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
            block_type: template.block_type,
            name: template.name,
            description: template.description,
            brand: template.brand,
            default_content: template.default_content,
            thumbnail_url: template.thumbnail_url,
            display_order: template.display_order,
            is_active: template.is_active,
            usage_count: template.usage_count,
            updated_at: new Date(template.updated_at),
          },
          create: {
            id: template.id,
            block_type: template.block_type,
            name: template.name,
            description: template.description,
            brand: template.brand,
            default_content: template.default_content,
            thumbnail_url: template.thumbnail_url,
            display_order: template.display_order,
            is_active: template.is_active,
            usage_count: template.usage_count,
            created_at: new Date(template.created_at),
            updated_at: new Date(template.updated_at),
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
            client_name: proposalData.client_name,
            client_contact_name: proposalData.client_contact_name,
            client_phone: proposalData.client_phone,
            client_email: proposalData.client_email,
            brand: proposalData.brand,
            status: proposalData.status,
            view_count: proposalData.view_count,
            last_viewed_at: proposalData.last_viewed_at ? new Date(proposalData.last_viewed_at) : null,
            is_template: proposalData.is_template,
            cloned_from_id: proposalData.cloned_from_id,
            created_by_id: proposalData.created_by_id,
            created_by_name: proposalData.created_by_name,
            published_at: proposalData.published_at ? new Date(proposalData.published_at) : null,
            updated_at: new Date(proposalData.updated_at),
          },
          create: {
            id: proposal.id,
            slug: proposalData.slug,
            client_name: proposalData.client_name,
            client_contact_name: proposalData.client_contact_name,
            client_phone: proposalData.client_phone,
            client_email: proposalData.client_email,
            brand: proposalData.brand,
            status: proposalData.status,
            view_count: proposalData.view_count,
            last_viewed_at: proposalData.last_viewed_at ? new Date(proposalData.last_viewed_at) : null,
            is_template: proposalData.is_template,
            cloned_from_id: proposalData.cloned_from_id,
            created_by_id: proposalData.created_by_id,
            created_by_name: proposalData.created_by_name,
            created_at: new Date(proposalData.created_at),
            published_at: proposalData.published_at ? new Date(proposalData.published_at) : null,
            updated_at: new Date(proposalData.updated_at),
          }
        });

        // Import blocks for this proposal
        for (const block of blocks) {
          await prisma.proposalBlock.upsert({
            where: { id: block.id },
            update: {
              proposal_id: block.proposal_id,
              block_type: block.block_type,
              display_order: block.display_order,
              is_enabled: block.is_enabled,
              content: block.content,
              template_id: block.template_id,
              updated_at: new Date(block.updated_at),
            },
            create: {
              id: block.id,
              proposal_id: block.proposal_id,
              block_type: block.block_type,
              display_order: block.display_order,
              is_enabled: block.is_enabled,
              content: block.content,
              template_id: block.template_id,
              created_at: new Date(block.created_at),
              updated_at: new Date(block.updated_at),
            }
          });
        }

        proposalResults.push({ id: created.id, client_name: created.client_name, blocks: blocks.length, status: 'success' });
      } catch (error) {
        proposalResults.push({ id: proposal.id, client_name: proposal.client_name, status: 'failed', error: (error as Error).message });
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
