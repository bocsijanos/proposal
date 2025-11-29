import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

// Helper to get session from JWT token directly (works better with Next.js 16 App Router)
async function getSessionFromToken(request: NextRequest) {
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET
  });
  if (!token) return null;
  return {
    user: {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as string,
    }
  };
}

// GET /api/block-templates - List all block templates
export async function GET(request: NextRequest) {
  try {
    // Try getToken first (more reliable with App Router), fallback to getServerSession
    let session = await getSessionFromToken(request);
    if (!session) {
      session = await getServerSession(authOptions);
    }
    console.log('🔍 GET /api/block-templates - Session:', session ? `${session.user?.email}` : 'NO SESSION');

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
    // Try getToken first (more reliable with App Router), fallback to getServerSession
    let session = await getSessionFromToken(request);
    if (!session) {
      session = await getServerSession(authOptions);
    }
    console.log('🔍 POST /api/block-templates - Session:', session ? `${session.user?.email}` : 'NO SESSION');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, defaultContent, brand } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    // NEW TEMPLATES GO TO THE BEGINNING (displayOrder: 0)
    // First, shift all existing templates down by 1
    const existingTemplates = await prisma.blockTemplate.findMany({
      where: { brand: brand || 'BOOM' },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, displayOrder: true },
    });

    // Shift existing templates down
    for (const template of existingTemplates) {
      await prisma.blockTemplate.update({
        where: { id: template.id },
        data: { displayOrder: template.displayOrder + 1 },
      });
    }

    // All templates are now PUCK_CONTENT type
    const newTemplate = await prisma.blockTemplate.create({
      data: {
        blockType: 'PUCK_CONTENT',
        name,
        description: description || null,
        defaultContent: defaultContent || { puckData: { content: [], root: { props: {} } } },
        brand: brand || 'BOOM',
        isActive: true,
        displayOrder: 0, // New templates always go to the beginning
      },
    });

    console.log('✅ New template created at beginning:', {
      id: newTemplate.id,
      name: newTemplate.name,
      displayOrder: newTemplate.displayOrder,
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

// PATCH /api/block-templates - Update template order (bulk update)
export async function PATCH(request: NextRequest) {
  try {
    // Try getToken first (more reliable with App Router), fallback to getServerSession
    let session = await getSessionFromToken(request);
    if (!session) {
      session = await getServerSession(authOptions);
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templates } = body;

    if (!Array.isArray(templates)) {
      return NextResponse.json(
        { error: 'Templates must be an array' },
        { status: 400 }
      );
    }

    // Two-phase update to avoid unique constraint conflicts (if any)
    // Phase 1: Set all displayOrders to negative values temporarily
    for (let i = 0; i < templates.length; i++) {
      await prisma.blockTemplate.update({
        where: { id: templates[i].id },
        data: {
          displayOrder: -(i + 1), // Negative temporary value
        },
      });
    }

    // Phase 2: Set final displayOrder values
    for (const template of templates) {
      await prisma.blockTemplate.update({
        where: { id: template.id },
        data: {
          displayOrder: template.displayOrder,
        },
      });
    }

    console.log('✅ Templates reordered successfully:', {
      count: templates.length,
      templates: templates.map((t: { id: string; displayOrder: number }) => ({
        id: t.id.slice(0, 8),
        order: t.displayOrder,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating template order:', error);
    return NextResponse.json(
      { error: 'Failed to update template order' },
      { status: 500 }
    );
  }
}
