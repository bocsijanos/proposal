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

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching block templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block templates' },
      { status: 500 }
    );
  }
}

// POST /api/block-templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, defaultContent, brand } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    // Get highest displayOrder for this brand
    const lastTemplate = await prisma.blockTemplate.findFirst({
      where: { brand: brand || 'BOOM' },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });

    const newDisplayOrder = (lastTemplate?.displayOrder ?? -1) + 1;

    // All templates are now PUCK_CONTENT type
    const newTemplate = await prisma.blockTemplate.create({
      data: {
        blockType: 'PUCK_CONTENT',
        name,
        description: description || null,
        defaultContent: defaultContent || { puckData: { content: [], root: { props: {} } } },
        brand: brand || 'BOOM',
        isActive: true,
        displayOrder: newDisplayOrder,
      },
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
