import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/block-templates - List all block templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get brand filter from query params
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand') as 'BOOM' | 'AIBOOST' | null;

    const templates = await prisma.blockTemplate.findMany({
      where: brand ? { brand } : undefined,
      orderBy: [
        { displayOrder: 'asc' },
        { blockType: 'asc' },
      ],
    });

    // Check which block types have ComponentSource (new system)
    const componentSources = await prisma.componentSource.findMany({
      select: { blockType: true },
    });

    const hasComponentSource = new Set(componentSources.map(cs => cs.blockType));

    // Add hasComponentSource flag to each template
    const enrichedTemplates = templates.map(template => ({
      ...template,
      hasComponentSource: hasComponentSource.has(template.blockType),
    }));

    return NextResponse.json(enrichedTemplates);
  } catch (error) {
    console.error('Error fetching block templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block templates' },
      { status: 500 }
    );
  }
}

// POST /api/block-templates - Create or update default templates
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templates } = body;

    if (!templates || !Array.isArray(templates)) {
      return NextResponse.json(
        { error: 'Templates array is required' },
        { status: 400 }
      );
    }

    // Upsert all templates
    const results = await Promise.all(
      templates.map((template: any) =>
        prisma.blockTemplate.upsert({
          where: {
            blockType_name_brand: {
              blockType: template.blockType,
              name: template.name || 'Default',
              brand: template.brand || 'BOOM',
            },
          },
          update: {
            defaultContent: template.defaultContent,
            description: template.description,
            isActive: template.isActive ?? true,
            displayOrder: template.displayOrder ?? 0,
            brand: template.brand || 'BOOM',
          },
          create: {
            blockType: template.blockType,
            name: template.name || 'Default',
            description: template.description,
            defaultContent: template.defaultContent,
            isActive: template.isActive ?? true,
            displayOrder: template.displayOrder ?? 0,
            brand: template.brand || 'BOOM',
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: results.length });
  } catch (error) {
    console.error('Error creating/updating templates:', error);
    return NextResponse.json(
      { error: 'Failed to create/update templates' },
      { status: 500 }
    );
  }
}
