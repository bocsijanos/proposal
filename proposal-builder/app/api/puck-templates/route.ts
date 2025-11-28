import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/puck-templates - List all user-created Puck templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');

    // Build where clause - show all templates (including inactive) for admin management
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (brand && (brand === 'BOOM' || brand === 'AIBOOST')) {
      where.brand = brand;
    }

    const templates = await prisma.puckTemplate.findMany({
      where,
      orderBy: [
        { usageCount: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        brand: true,
        thumbnailUrl: true,
        usageCount: true,
        isActive: true,
        data: true,
        createdAt: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Return array directly for frontend compatibility
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching puck templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/puck-templates - Create a new Puck template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, data, brand } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Template name is required' },
        { status: 400 }
      );
    }

    if (!data || !data.content) {
      return NextResponse.json(
        { error: 'Template data is required' },
        { status: 400 }
      );
    }

    // Create the template
    const template = await prisma.puckTemplate.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        category: category || 'custom',
        data: data,
        brand: brand || 'BOOM',
        createdById: session.user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        brand: true,
        createdAt: true,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating puck template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
