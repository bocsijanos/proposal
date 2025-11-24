import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/save-block-as-template - Save a single block as a template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { blockType, content, isActive, brand } = body;

    if (!blockType || !content || !brand) {
      return NextResponse.json(
        { error: 'Block type, content, and brand are required' },
        { status: 400 }
      );
    }

    // Find the maximum displayOrder to add this template at the end
    const maxOrderTemplate = await prisma.blockTemplate.findFirst({
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });

    const newDisplayOrder = (maxOrderTemplate?.displayOrder ?? -1) + 1;

    console.log(`📋 Saving block as template: ${blockType} at position ${newDisplayOrder}`);

    // Generate a unique name for this template (scoped by brand)
    const existingTemplatesCount = await prisma.blockTemplate.count({
      where: {
        blockType,
        brand,
        name: {
          startsWith: 'Egyedi',
        },
      },
    });

    const templateName = existingTemplatesCount === 0
      ? 'Egyedi'
      : `Egyedi ${existingTemplatesCount + 1}`;

    // Create the new template
    const template = await prisma.blockTemplate.create({
      data: {
        blockType,
        name: templateName,
        description: `Egyedi ${blockType.replace(/_/g, ' ')} sablon`,
        defaultContent: content,
        displayOrder: newDisplayOrder,
        isActive: isActive ?? true,
        brand,
      },
    });

    console.log(`✅ Template saved: ${templateName} (${blockType})`);

    return NextResponse.json({
      success: true,
      message: 'Block saved as template successfully',
      template,
    });
  } catch (error) {
    console.error('Error saving block as template:', error);
    return NextResponse.json(
      { error: 'Failed to save block as template' },
      { status: 500 }
    );
  }
}
